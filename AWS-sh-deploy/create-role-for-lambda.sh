#!/bin/bash
roleName=lambda-ex
policyFilePath=file://trust-policy.json
aws iam create-role --role-name $roleName --assume-role-policy-document $policyFilePath
aws iam attach-role-policy --role-name $roleName --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole