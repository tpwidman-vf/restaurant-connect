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

test('S3 bucket created', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new Cdk.CdkStack(app, 'RestaurantConnectStack');
    expectCDK(stack).to(haveResource("AWS::S3::Bucket"));
});
test('Lambda function created', () => {
    const app = new cdk.App();
    const stack = new Cdk.CdkStack(app, 'RestaurantConnectStack');
    expectCDK(stack).to(haveResource("AWS::Lambda::Function", {
        "FunctionName": "createOrders"
    }).and(haveResource("AWS::IAM::Policy")));
})