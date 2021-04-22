#!/bin/bash

if ! [ -x "$(command -v cdk)" ]; then
  echo 'cdk is not installed, so I am installing it now.'
  npm install -g aws-cdk
fi

echo "The following changes will be applied to your AWS account:"

# pass all commandline arguments so we can treat this like any other AWS
# command with the multitude of switches they allow to be passed.
cdk diff "$@"