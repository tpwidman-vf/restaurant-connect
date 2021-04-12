#!/bin/bash

if ! [ -x "$(command -v cdk)" ]; then
  echo 'cdk is not installed, so I am installing it now.'
  npm install -g aws-cdk
fi

cd tf/
../deploy/install-terraform.sh
echo "Destroying lexbot resources with Terraform..."
./terraform destroy -auto-approve
rm terraform

cd ../cdk/
# pass all commandline arguments so we can treat this like any other AWS
# command with the multitude of switches they allow to be passed.
cdk destroy "$@"