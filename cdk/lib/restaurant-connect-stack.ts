import * as cdk from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as s3 from '@aws-cdk/aws-s3';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigw from '@aws-cdk/aws-apigateway';


import { TableEncryption } from '@aws-cdk/aws-dynamodb';
import { BlockPublicAccess, BucketEncryption } from '@aws-cdk/aws-s3';
import { RemovalPolicy } from '@aws-cdk/core';

export class CdkStack extends cdk.Stack {

  // Orders table
  public readonly table: dynamodb.Table;

  // Create orders lambda
  public readonly createOrdersFunction: lambda.Function;

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
    table.grantReadWriteData(createOrdersLambda);
    this.createOrdersFunction = createOrdersLambda;

    // const hello = new lambda.Function(this, 'rcHealthCheckEndpoint', {
    //   runtime: lambda.Runtime.NODEJS_12_X, 
    //   code: lambda.Code.fromAsset('lambda'),
    //   handler: 'hello.handler'
    // });

    // new apigw.LambdaRestApi(this, 'Endpoint', {
    //   handler: hello
    // });

  }
}
