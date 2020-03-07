package main

import (
	"context"
	"encoding/json"
	"fmt"
	"os"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/apigatewaymanagementapi"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
)

// ReceiveData ...
type ReceiveData struct {
	Message string      `json:"message"`
	Data    json.Number `data:"message"`
}

// PostData ...
type PostData struct {
	Type string      `json:"type"`
	Data json.Number `json:"data"`
}

// Connection ...
type Connection struct {
	ConnectionID string `dynamodbav:"connectionId"`
}

var (
	ddb = dynamodb.New(session.New(), aws.NewConfig().WithRegion("ap-northeast-1"))
)

func handler(ctx context.Context, request events.APIGatewayWebsocketProxyRequest) (events.APIGatewayProxyResponse, error) {
	tableName := os.Getenv("TABLE_NAME")
	param := &dynamodb.ScanInput{
		TableName:            aws.String(tableName),
		ProjectionExpression: aws.String("connectionId"),
	}

	result, err := ddb.Scan(param)
	if err != nil {
		fmt.Println(err)
		return events.APIGatewayProxyResponse{
			Body:       fmt.Sprintf("Failed to scan: %v", string(err.Error())),
			StatusCode: 500,
		}, nil
	}
	fmt.Println(result)

	var config *aws.Config
	sess, err := session.NewSession(config)
	if err != nil {
		fmt.Println(err)
		return events.APIGatewayProxyResponse{
			Body:       fmt.Sprintf("Failed to session: %v", string(err.Error())),
			StatusCode: 500,
		}, nil
	}

	svc := apigatewaymanagementapi.New(sess)
	svc.Endpoint = fmt.Sprintf("https://%s/%s", request.RequestContext.DomainName, request.RequestContext.Stage)

	var receiveData ReceiveData
	err = json.Unmarshal([]byte(request.Body), &receiveData)
	if err != nil {
		return events.APIGatewayProxyResponse{
			Body:       fmt.Sprintf("Failed to Unmarshal: %v", string(err.Error())),
			StatusCode: 500,
		}, nil
	}

	var connections []Connection
	err = dynamodbattribute.UnmarshalListOfMaps(result.Items, &connections)
	if err != nil {
		return events.APIGatewayProxyResponse{
			Body:       fmt.Sprintf("Failed to UnmarshalList: %v", string(err.Error())),
			StatusCode: 500,
		}, nil
	}

	postData := PostData{
		Type: "location",
		Data: receiveData.Data,
	}

	jsonBytes, err := json.Marshal(postData)
	if err != nil {
		return events.APIGatewayProxyResponse{
			Body:       fmt.Sprintf("Failed to Marshal: %v", string(err.Error())),
			StatusCode: 500,
		}, nil
	}

	for _, conn := range connections {
		connectionID := conn.ConnectionID
		// ひとまず自分にだけ送信する
		if request.RequestContext.ConnectionID == connectionID {
			svc.PostToConnection(&apigatewaymanagementapi.PostToConnectionInput{
				ConnectionId: &connectionID,
				Data:         jsonBytes,
			})
		}
	}

	return events.APIGatewayProxyResponse{
		Body:       "Location Sent.",
		StatusCode: 200,
	}, nil
}

func main() {
	lambda.Start(handler)
}
