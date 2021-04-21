#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { CdkStack } from '../lib/restaurant-connect-stack';

const app = new cdk.App();
new CdkStack(app, 'RestaurantConnectStack');
