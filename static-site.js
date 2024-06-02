#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaticSite = void 0;
const aws_s3_1 = require("aws-cdk-lib/aws-s3");
const aws_s3_deployment_1 = require("aws-cdk-lib/aws-s3-deployment");
const aws_cloudfront_1 = require("aws-cdk-lib/aws-cloudfront");
const aws_iam_1 = require("aws-cdk-lib/aws-iam");
const constructs_1 = require("constructs");
class StaticSite extends constructs_1.Construct {
    constructor(parent, name) {
        super(parent, name);
        const cloudfrontOAI = new aws_cloudfront_1.OriginAccessIdentity(this, 'Satlykov-OAI');
        const siteBucket = new aws_s3_1.Bucket(this, "SatlykovStaticBucket", {
            bucketName: "satlykov-shop-app",
            websiteIndexDocument: "index.html",
            publicReadAccess: false,
            blockPublicAccess: aws_s3_1.BlockPublicAccess.BLOCK_ALL
        });
        siteBucket.addToResourcePolicy(new aws_iam_1.PolicyStatement({
            actions: ["S3:GetObject"],
            resources: [siteBucket.arnForObjects("*")],
            principals: [new aws_iam_1.CanonicalUserPrincipal(cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId)]
        }));
        const distribution = new aws_cloudfront_1.CloudFrontWebDistribution(this, 'Satlykov-distribution', {
            originConfigs: [{
                    s3OriginSource: {
                        s3BucketSource: siteBucket,
                        originAccessIdentity: cloudfrontOAI,
                    },
                    behaviors: [{
                            isDefaultBehavior: true
                        }]
                }]
        });
        new aws_s3_deployment_1.BucketDeployment(this, 'Satlykov-Bucket-Deployment', {
            sources: [aws_s3_deployment_1.Source.asset("./website/nodejs-aws-shop-react/dist")],
            destinationBucket: siteBucket,
            distribution,
            distributionPaths: ["/*"]
        });
    }
}
exports.StaticSite = StaticSite;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGljLXNpdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdGF0aWMtc2l0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBRUEsK0NBQStEO0FBQy9ELHFFQUF5RTtBQUN6RSwrREFBNkY7QUFDN0YsaURBQThFO0FBQzlFLDJDQUF1QztBQUV2QyxNQUFhLFVBQVcsU0FBUSxzQkFBUztJQUN2QyxZQUFZLE1BQWEsRUFBRSxJQUFZO1FBQ3JDLEtBQUssQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFcEIsTUFBTSxhQUFhLEdBQUcsSUFBSSxxQ0FBb0IsQ0FBQyxJQUFJLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFFckUsTUFBTSxVQUFVLEdBQUcsSUFBSSxlQUFNLENBQUMsSUFBSSxFQUFFLHNCQUFzQixFQUFFO1lBQzFELFVBQVUsRUFBRSxtQkFBbUI7WUFDL0Isb0JBQW9CLEVBQUUsWUFBWTtZQUNsQyxnQkFBZ0IsRUFBRSxLQUFLO1lBQ3ZCLGlCQUFpQixFQUFFLDBCQUFpQixDQUFDLFNBQVM7U0FDL0MsQ0FBQyxDQUFBO1FBRUYsVUFBVSxDQUFDLG1CQUFtQixDQUFDLElBQUkseUJBQWUsQ0FBQztZQUNqRCxPQUFPLEVBQUUsQ0FBQyxjQUFjLENBQUM7WUFDekIsU0FBUyxFQUFFLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMxQyxVQUFVLEVBQUUsQ0FBQyxJQUFJLGdDQUFzQixDQUFDLGFBQWEsQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO1NBQ3hHLENBQUMsQ0FBQyxDQUFBO1FBRUgsTUFBTSxZQUFZLEdBQUcsSUFBSSwwQ0FBeUIsQ0FBQyxJQUFJLEVBQUUsdUJBQXVCLEVBQUU7WUFDaEYsYUFBYSxFQUFFLENBQUM7b0JBQ2QsY0FBYyxFQUFFO3dCQUNkLGNBQWMsRUFBRSxVQUFVO3dCQUMxQixvQkFBb0IsRUFBRSxhQUFhO3FCQUNwQztvQkFDRCxTQUFTLEVBQUUsQ0FBQzs0QkFDVixpQkFBaUIsRUFBRSxJQUFJO3lCQUN4QixDQUFDO2lCQUNILENBQUM7U0FDSCxDQUFDLENBQUE7UUFFRixJQUFJLG9DQUFnQixDQUFDLElBQUksRUFBRSw0QkFBNEIsRUFBRTtZQUN2RCxPQUFPLEVBQUUsQ0FBQywwQkFBTSxDQUFDLEtBQUssQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO1lBQy9ELGlCQUFpQixFQUFFLFVBQVU7WUFDN0IsWUFBWTtZQUNaLGlCQUFpQixFQUFFLENBQUMsSUFBSSxDQUFDO1NBQzFCLENBQUMsQ0FBQTtJQUNKLENBQUM7Q0FDRjtBQXRDRCxnQ0FzQ0MiLCJzb3VyY2VzQ29udGVudCI6WyIjIS91c3IvYmluL2VudiBub2RlXG5pbXBvcnQgeyBTdGFjayB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IEJ1Y2tldCwgQmxvY2tQdWJsaWNBY2Nlc3MgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtczMnO1xuaW1wb3J0IHsgQnVja2V0RGVwbG95bWVudCwgU291cmNlIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLXMzLWRlcGxveW1lbnQnO1xuaW1wb3J0IHsgT3JpZ2luQWNjZXNzSWRlbnRpdHksIENsb3VkRnJvbnRXZWJEaXN0cmlidXRpb24gfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtY2xvdWRmcm9udCc7XG5pbXBvcnQgeyBQb2xpY3lTdGF0ZW1lbnQsIENhbm9uaWNhbFVzZXJQcmluY2lwYWwgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtaWFtJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gXCJjb25zdHJ1Y3RzXCI7XG5cbmV4cG9ydCBjbGFzcyBTdGF0aWNTaXRlIGV4dGVuZHMgQ29uc3RydWN0IHtcbiAgY29uc3RydWN0b3IocGFyZW50OiBTdGFjaywgbmFtZTogc3RyaW5nKSB7XG4gICAgc3VwZXIocGFyZW50LCBuYW1lKTtcblxuICAgIGNvbnN0IGNsb3VkZnJvbnRPQUkgPSBuZXcgT3JpZ2luQWNjZXNzSWRlbnRpdHkodGhpcywgJ1NhdGx5a292LU9BSScpO1xuXG4gICAgY29uc3Qgc2l0ZUJ1Y2tldCA9IG5ldyBCdWNrZXQodGhpcywgXCJTYXRseWtvdlN0YXRpY0J1Y2tldFwiLCB7XG4gICAgICBidWNrZXROYW1lOiBcInNhdGx5a292LXNob3AtYXBwXCIsXG4gICAgICB3ZWJzaXRlSW5kZXhEb2N1bWVudDogXCJpbmRleC5odG1sXCIsXG4gICAgICBwdWJsaWNSZWFkQWNjZXNzOiBmYWxzZSxcbiAgICAgIGJsb2NrUHVibGljQWNjZXNzOiBCbG9ja1B1YmxpY0FjY2Vzcy5CTE9DS19BTExcbiAgICB9KVxuXG4gICAgc2l0ZUJ1Y2tldC5hZGRUb1Jlc291cmNlUG9saWN5KG5ldyBQb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgYWN0aW9uczogW1wiUzM6R2V0T2JqZWN0XCJdLFxuICAgICAgcmVzb3VyY2VzOiBbc2l0ZUJ1Y2tldC5hcm5Gb3JPYmplY3RzKFwiKlwiKV0sXG4gICAgICBwcmluY2lwYWxzOiBbbmV3IENhbm9uaWNhbFVzZXJQcmluY2lwYWwoY2xvdWRmcm9udE9BSS5jbG91ZEZyb250T3JpZ2luQWNjZXNzSWRlbnRpdHlTM0Nhbm9uaWNhbFVzZXJJZCldXG4gICAgfSkpXG5cbiAgICBjb25zdCBkaXN0cmlidXRpb24gPSBuZXcgQ2xvdWRGcm9udFdlYkRpc3RyaWJ1dGlvbih0aGlzLCAnU2F0bHlrb3YtZGlzdHJpYnV0aW9uJywge1xuICAgICAgb3JpZ2luQ29uZmlnczogW3tcbiAgICAgICAgczNPcmlnaW5Tb3VyY2U6IHtcbiAgICAgICAgICBzM0J1Y2tldFNvdXJjZTogc2l0ZUJ1Y2tldCxcbiAgICAgICAgICBvcmlnaW5BY2Nlc3NJZGVudGl0eTogY2xvdWRmcm9udE9BSSxcbiAgICAgICAgfSxcbiAgICAgICAgYmVoYXZpb3JzOiBbe1xuICAgICAgICAgIGlzRGVmYXVsdEJlaGF2aW9yOiB0cnVlXG4gICAgICAgIH1dXG4gICAgICB9XVxuICAgIH0pXG5cbiAgICBuZXcgQnVja2V0RGVwbG95bWVudCh0aGlzLCAnU2F0bHlrb3YtQnVja2V0LURlcGxveW1lbnQnLCB7XG4gICAgICBzb3VyY2VzOiBbU291cmNlLmFzc2V0KFwiLi93ZWJzaXRlL25vZGVqcy1hd3Mtc2hvcC1yZWFjdC9kaXN0XCIpXSxcbiAgICAgIGRlc3RpbmF0aW9uQnVja2V0OiBzaXRlQnVja2V0LFxuICAgICAgZGlzdHJpYnV0aW9uLFxuICAgICAgZGlzdHJpYnV0aW9uUGF0aHM6IFtcIi8qXCJdXG4gICAgfSlcbiAgfVxufVxuIl19