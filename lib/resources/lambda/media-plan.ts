import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { config } from 'node-config-ts';
import { HttpMethod } from '@aws-cdk/aws-apigatewayv2-alpha';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { LambdaResources } from '../../types';

export class MediaPlanFunctionConstruct extends Construct {
  handler: lambda.NodejsFunction;

  constructor(scope: Construct, id: string, resources: LambdaResources) {
    super(scope, id);
    const { vpc, apiGateway } = resources;

    this.handler = new lambda.NodejsFunction(this, 'MediaPlan', {
      runtime: Runtime.NODEJS_18_X,
      functionName: `mediaPlan-${config.stage}`,
      entry: './src/mediaPlan/handler.ts',
      handler: 'handler',
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
      environment: {
        NODE_ENV: config.NODE_ENV,
        ENV: config.NODE_ENV,
      },
      bundling: {
        preCompilation: false,
        externalModules: ['aws-sdk', 'config'],
      },
    });

    const lambdaIntegration = new HttpLambdaIntegration(
      'MediaPlanIntegration',
      this.handler,
    );

    apiGateway.addRoutes({
      path: '/media-plans',
      methods: [HttpMethod.ANY],
      integration: lambdaIntegration,
    });
  }
}
