#!/bin/bash
export BASE_DIRECTORY=`pwd`

echo "Building createOrder lambda"
cd $BASE_DIRECTORY/packages/createOrder
npm run build

echo "Building getOrderStatus lambda"
cd $BASE_DIRECTORY/packages/getOrderStatus
npm run build

echo "Building orders API"
cd $BASE_DIRECTORY/packages/ordersApi
npm run build

cd $BASE_DIRECTORY/cdk/

echo "The following changes will be applied to your AWS account:"

# pass all commandline arguments so we can treat this like any other AWS
# command with the multitude of switches they allow to be passed.
cdk diff "$@"

echo "Deploying changes above using CDK...."
cdk deploy "$@"

echo "Applying Lex Bot, Intents, and Slots using Terraform..."
cd $BASE_DIRECTORY/tf

# download dependent terraform version
$BASE_DIRECTORY/deploy/install-terraform.sh

# download dependent terraform version
./terraform init
./terraform plan
./terraform apply

rm terraform
cd ../