import * as cdk from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
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

  }
}
