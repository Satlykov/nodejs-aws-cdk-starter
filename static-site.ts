#!/usr/bin/env node
import { Stack } from 'aws-cdk-lib';
import { Bucket, BlockPublicAccess } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import { OriginAccessIdentity, CloudFrontWebDistribution } from 'aws-cdk-lib/aws-cloudfront';
import { PolicyStatement, CanonicalUserPrincipal } from 'aws-cdk-lib/aws-iam';
import { Construct } from "constructs";

export class StaticSite extends Construct {
  constructor(parent: Stack, name: string) {
    super(parent, name);

    const cloudfrontOAI = new OriginAccessIdentity(this, 'Satlykov-OAI');

    const siteBucket = new Bucket(this, "SatlykovStaticBucket", {
      bucketName: "satlykov-shop-app",
      websiteIndexDocument: "index.html",
      publicReadAccess: false,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL
    })

    siteBucket.addToResourcePolicy(new PolicyStatement({
      actions: ["S3:GetObject"],
      resources: [siteBucket.arnForObjects("*")],
      principals: [new CanonicalUserPrincipal(cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId)]
    }))

    const distribution = new CloudFrontWebDistribution(this, 'Satlykov-distribution', {
      originConfigs: [{
        s3OriginSource: {
          s3BucketSource: siteBucket,
          originAccessIdentity: cloudfrontOAI,
        },
        behaviors: [{
          isDefaultBehavior: true
        }]
      }]
    })

    new BucketDeployment(this, 'Satlykov-Bucket-Deployment', {
      sources: [Source.asset("./website/nodejs-aws-shop-react/dist")],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ["/*"]
    })
  }
}
