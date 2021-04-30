#!/bin/bash
cd packages/restaurant-connect-ui
export SKIP_PREFLIGHT_CHECK=true
npm run build
aws s3 cp ./build s3://orderstatus.vf-team8.com --recursive