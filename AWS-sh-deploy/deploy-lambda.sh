#!/bin/bash

zipLambdaFile=function.zip
lambdaFile=index.js
lambdaHandler=index.handler
lambdaRuntime=nodejs14.x
funnctionName=my-function

role_arm=$(aws iam get-role --role-name lambda-ex | jq '.Role.Arn' | tr -d \")
zip $zipLambdaFile $lambdaFile
aws lambda create-function --function-name $funnctionName \
--zip-file fileb://$zipLambdaFile --handler $lambdaHandler --runtime $lambdaRuntime \
--role $role_arm
aws lambda invoke --function-name $funnctionName out --log-type Tail \
--query 'LogResult' --output text |  base64 -D