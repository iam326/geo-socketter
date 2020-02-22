.PHONY: deps clean build

deps:
	go get -u ./...

clean:
	rm -rf ./handlers
	
build:
	GOOS=linux GOARCH=amd64 go build -o ./handlers ./onconnect
	GOOS=linux GOARCH=amd64 go build -o ./handlers ./ondisconnect
	GOOS=linux GOARCH=amd64 go build -o ./handlers ./sendmessage