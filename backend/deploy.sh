#!/bin/bash

set -euo pipefail

source ../config.sh

readonly STACK_NAME="${PROJECT_NAME}-backend"
readonly TEMPLATE_FILE="$(pwd)/template.yaml"

make build

sam package \
  --output-template-file packaged.yaml \
  --s3-bucket ${ARTIFACT_BUCKET_NAME}

sam deploy \
  --template-file packaged.yaml \
  --stack-name ${STACK_NAME} \
  --capabilities CAPABILITY_IAM

rm packaged.yaml
