import * as cdk from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as lambda from '@aws-cdk/aws-lambda';
import * as s3 from '@aws-cdk/aws-s3';

import { TableEncryption } from '@aws-cdk/aws-dynamodb';
import { BlockPublicAccess, BucketEncryption } from '@aws-cdk/aws-s3';
import { RemovalPolicy } from '@aws-cdk/core';

export class CdkStack extends cdk.Stack {

  // Orders table
  public readonly table: dynamodb.Table;

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB orders table
    let tableName = 'Orders';
    const table = new dynamodb.Table(this, tableName, {
      partitionKey: {
        name: 'orderId',
        type: dynamodb.AttributeType.STRING,
      },
      encryption: TableEncryption.AWS_MANAGED,
      tableName: tableName,
    });
    // gsi for phone number lookups
    table.addGlobalSecondaryIndex({
      indexName: 'PhoneNumber-Index',
      partitionKey: { name: 'phoneNumber', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'updatedAt', type: dynamodb.AttributeType.STRING }
    });
    this.table = table;

    // S3 bucket to store terraform state for LexBots.  Why?  CDK and cloudformation don't support
    // LexBots.  But Terraform does.  So we make the competing technologies work together!
    const s3StateBucket = new s3.Bucket(this, 'terraformStateBucket', {
      versioned: true,
      bucketName: 'vf-restaurant-connect-terraform-state', 
      encryption: BucketEncryption.KMS_MANAGED,
      publicReadAccess: false,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      removalPolicy: RemovalPolicy.DESTROY,
    });
    // a Lambda function that gets granted access to the table would go here.  Along with any other lambdas
    // that might need to talk to it.
    const createOrdersLambda = new lambda.Function(this, 'createOrders', {
      functionName: "createOrders",
      runtime: lambda.Runtime.NODEJS_12_X,
      environment: {
        TABLE_NAME: tableName,
        SERVICE_NAME: 'createOrders',
        LOG_LEVEL: 'info',
      },
      code: lambda.Code.fromAsset('../packages/createOrder/dist'),
      handler: 'index.handler',
      timeout: cdk.Duration.seconds(60),
      memorySize: 1024,
    });


    // getOrderStatus lambda function
    const getOrderStatusLambda = new lambda.Function(this, 'getOrderStatus', {
      functionName: "getOrderStatus",
      runtime: lambda.Runtime.NODEJS_12_X,
      environment: {
        TABLE_NAME: tableName,
        SERVICE_NAME: 'getOrderStatus',
        LOG_LEVEL: 'info',
      },
      code: lambda.Code.fromAsset('../packages/getOrderStatus/dist'),
      handler: 'index.handler',
      timeout: cdk.Duration.seconds(7),
      memorySize: 1024,
    });
    this.table.grantReadData(getOrderStatusLambda);

  }
}
