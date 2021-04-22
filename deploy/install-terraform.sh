#!/bin/bash
export TF_VERSION=0.14.9
echo "downloading terraform $TF_VERSION...."
curl -Lfso- https://releases.hashicorp.com/terraform/${TF_VERSION}/terraform_${TF_VERSION}_$(uname | tr '[:upper:]' '[:lower:]')_amd64.zip > terraform.zip
unzip -o terraform.zip
rm terraform.zip
chmod +x ./terraform
./terraform -version