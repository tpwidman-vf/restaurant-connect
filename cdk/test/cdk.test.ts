import { expect as expectCDK, haveResource } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as Cdk from '../lib/restaurant-connect-stack';

test('Dynamo DB table Created', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new Cdk.CdkStack(app, 'RestaurantConnectStack');
    // THEN
    expectCDK(stack).to(haveResource("AWS::DynamoDB::Table"));
});

