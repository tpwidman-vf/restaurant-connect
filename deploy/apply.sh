#!/bin/bash
if ! [ -x "$(command -v cdk)" ]; then
  echo 'cdk is not installed, so I am installing it now.'
  npm install -g aws-cdk
fi
if ! [ -x "$(command -v typescript)" ]; then
  echo 'cdk is not installed, so I am installing it now.'
  npm install -g typescript
fi


cd cdk/

echo "The following changes will be applied to your AWS account:"

# pass all commandline arguments so we can treat this like any other AWS
# command with the multitude of switches they allow to be passed.
cdk diff "$@"

echo "Deploying changes above using CDK...."
cdk deploy "$@"

echo "Applying Lex Bot, Intents, and Slots using Terraform..."
cd ../tf

# download dependent terraform version
../deploy/install-terraform.sh

# download dependent terraform version
./terraform plan
./terraform apply

rm terraform
cd ../