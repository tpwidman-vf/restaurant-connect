#!/bin/bash

if ! [ -x "$(command -v cdk)" ]; then
  echo 'cdk is not installed, so I am installing it now.'
  npm install -g aws-cdk
fi

# pass all commandline arguments so we can treat this like any other AWS
# command with the multitude of switches they allow to be passed.
cdk destroy "$@"