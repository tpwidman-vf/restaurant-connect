#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { CdkStack } from '../lib/restaurant-connect-stack';

const envUSA = { account: '252608137475', region: 'us-east-1' };

const app = new cdk.App();
new CdkStack(app, 'RestaurantConnectStack', { env: envUSA });
