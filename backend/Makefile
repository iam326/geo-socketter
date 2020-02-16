.PHONY: deps clean build

deps:
	go get -u ./...

clean:
	rm -rf ./onconnect/onconnect
	rm -rf ./ondisconnect/ondisconnect
	rm -rf ./sendmessage/sendmessage
	
build:
	GOOS=linux GOARCH=amd64 go build -o onconnect/onconnect ./onconnect
	GOOS=linux GOARCH=amd64 go build -o ondisconnect/ondisconnect ./ondisconnect
	GOOS=linux GOARCH=amd64 go build -o sendmessage/sendmessage ./sendmessage