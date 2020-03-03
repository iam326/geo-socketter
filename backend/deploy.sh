#!/bin/bash

set -euo pipefail

source ../config.sh

readonly STACK_NAME="${PROJECT_NAME}-backend"
readonly TEMPLATE_FILE="$(pwd)/template.yaml"
readonly CONNECTIONS_TABLE_NAME="${PROJECT_NAME}-connections"
readonly WEB_SOCKET_NAME="${PROJECT_NAME}-websocket"

make build

sam package \
  --output-template-file packaged.yaml \
  --s3-bucket ${ARTIFACT_BUCKET_NAME}

sam deploy \
  --template-file packaged.yaml \
  --stack-name ${STACK_NAME} \
  --capabilities CAPABILITY_IAM \
  --parameter-overrides \
    NamePrefix=${PROJECT_NAME} \
    ConnectionsTableName=${CONNECTIONS_TABLE_NAME} \
    WebSocketName=${WEB_SOCKET_NAME}

rm packaged.yaml

WEB_SOCKET_URI=$(aws cloudformation describe-stacks \
  --stack-name ${STACK_NAME} \
  --query 'Stacks[].Outputs[?OutputKey==`WebSocketURI`].OutputValue' \
  --output text)

echo "
REACT_APP_WEB_SOCKET_URI=${WEB_SOCKET_URI}
" > ../frontend/.env
