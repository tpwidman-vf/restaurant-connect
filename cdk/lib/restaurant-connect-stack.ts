import * as cdk from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as s3 from '@aws-cdk/aws-s3';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigw from '@aws-cdk/aws-apigateway';
import * as sns from '@aws-cdk/aws-sns';
import * as subs from '@aws-cdk/aws-sns-subscriptions';
import * as sqs from '@aws-cdk/aws-sqs';

import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as route53 from '@aws-cdk/aws-route53';
import * as s3deploy from '@aws-cdk/aws-s3-deployment';
import * as acm from '@aws-cdk/aws-certificatemanager';
import * as targets from '@aws-cdk/aws-route53-targets/lib';

import { StreamViewType, TableEncryption } from '@aws-cdk/aws-dynamodb';
import { BlockPublicAccess, BucketEncryption } from '@aws-cdk/aws-s3';
import { Aws, RemovalPolicy } from '@aws-cdk/core';

export class CdkStack extends cdk.Stack {

  // Orders table
  public readonly table: dynamodb.Table;

  // Create orders lambda
  public readonly createOrdersFunction: lambda.Function;

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const s3DynamoExportBucket = new s3.Bucket(this, 'dynamoExportBucket', {
      versioned: true,
      bucketName: 'vf-restaurant-connect-dynamo-export', 
      encryption: BucketEncryption.KMS_MANAGED,
      publicReadAccess: false,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    // DynamoDB orders table
    let tableName = 'Orders';
    const table = new dynamodb.Table(this, tableName, {
      partitionKey: {
        name: 'orderId',
        type: dynamodb.AttributeType.STRING,
      },
      encryption: TableEncryption.AWS_MANAGED,
      tableName: tableName,
      // enable back ups for putting the table in s3 for ETL.
      pointInTimeRecovery: true,
      // enable streaming for triggers.
      stream: StreamViewType.NEW_IMAGE,
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
        LOG_LEVEL: 'debug',
        ORDERS_EMAIL: 'success@simulator.amazonses.com'
      },
      code: lambda.Code.fromAsset('../packages/createOrder/dist'),
      handler: 'index.handler',
      timeout: cdk.Duration.seconds(60),
      memorySize: 1024,
    });


    table.grantReadWriteData(createOrdersLambda);
    this.createOrdersFunction = createOrdersLambda;

    const queue = new sqs.Queue(this, 'OrderQueue', {
      visibilityTimeout: cdk.Duration.seconds(300)
    });

    const topic = new sns.Topic(this, 'OrderTopic');

    topic.addSubscription(new subs.SqsSubscription(queue));

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

    // Order status UI.  In order to serverlessly host a React UI, you need the following elements

    // step 1: a domain name in an existing hosted zone (admittedly this optional but much cooler than using a xxxxx.cloudfront.net domain)
    const domainName = 'vf-team8.com';
    const siteSubDomain = 'orderstatus';
    const zone = route53.HostedZone.fromLookup(this, 'Zone', { domainName: domainName });
    const siteDomain = siteSubDomain + '.' + domainName;
    new cdk.CfnOutput(this, 'Site', { value: 'https://' + siteDomain });

    // step 2: an S3 bucket to put all your "stuff".  Ie the outputs of npm run build in your react app.
    // Content bucket
    const siteBucket = new s3.Bucket(this, 'SiteBucket', {
      bucketName: siteDomain,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'error.html',
      publicReadAccess: true,
      encryption: BucketEncryption.KMS_MANAGED,
      // The default removal policy is RETAIN, which means that cdk destroy will not attempt to delete
      // the new bucket, and it will remain in your account until manually deleted. By setting the policy to
      // DESTROY, cdk destroy will attempt to delete the bucket, but will error if the bucket is not empty.
      removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production code
    });
    new cdk.CfnOutput(this, 'Bucket', { value: siteBucket.bucketName });
    
    // TLS certificate
    const certificateArn = new acm.DnsValidatedCertificate(this, 'SiteCertificate', {
      domainName: siteDomain,
      hostedZone: zone,
      region: 'us-east-1', // Cloudfront only checks this region for certificates.
    }).certificateArn;
    new cdk.CfnOutput(this, 'Certificate', { value: certificateArn });

    const distribution = new cloudfront.CloudFrontWebDistribution(this, 'SiteDistribution', {
      aliasConfiguration: {
        acmCertRef: certificateArn,
        names: [siteDomain],
        sslMethod: cloudfront.SSLMethod.SNI,
        securityPolicy: cloudfront.SecurityPolicyProtocol.TLS_V1_1_2016,
      },
      originConfigs: [
        {
          customOriginSource: {
            domainName: siteBucket.bucketWebsiteDomainName,
            originProtocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
          },
          behaviors: [{ isDefaultBehavior: true }],
        }
      ]
    });
    new cdk.CfnOutput(this, 'DistributionId', { value: distribution.distributionId });

    // Route53 alias record for the CloudFront distribution    
    new route53.ARecord(this, 'SiteAliasRecord', {
      recordName: siteDomain,
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
      zone
    });    

    new s3deploy.BucketDeployment(this, 'DeployWithInvalidation', {
      sources: [s3deploy.Source.asset('../packages/restaurant-connect-ui/build/')], 
      destinationBucket: siteBucket,
      distribution, 
      distributionPaths: ['/*'],
    });
  }
}
