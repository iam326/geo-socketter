package main

import (
	"fmt"
	"os"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
)

var (
	ddb = dynamodb.New(session.New(), aws.NewConfig().WithRegion("ap-northeast-1"))
)

func handler(request events.APIGatewayWebsocketProxyRequest) (events.APIGatewayProxyResponse, error) {
	tableName := os.Getenv("TABLE_NAME")
	param := &dynamodb.PutItemInput{
		TableName: aws.String(tableName),
		Item: map[string]*dynamodb.AttributeValue{
			"connectionId": {
				S: aws.String(request.RequestContext.ConnectionID),
			},
		},
	}

	item, err := ddb.PutItem(param)
	if err != nil {
		fmt.Println(err)
		return events.APIGatewayProxyResponse{
			Body:       fmt.Sprintf("Failed to connect: %v", string(err.Error())),
			StatusCode: 500,
		}, nil
	}
	fmt.Println(item)

	return events.APIGatewayProxyResponse{
		Body:       "Connected.",
		StatusCode: 200,
	}, nil
}

func main() {
	lambda.Start(handler)
}
