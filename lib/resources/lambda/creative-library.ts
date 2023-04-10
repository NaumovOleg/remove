import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { config } from 'node-config-ts';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import { HttpMethod } from '@aws-cdk/aws-apigatewayv2-alpha';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { LambdaResources } from '../../types';

export class CreativeLibraryFunctionConstruct extends Construct {
  handler: lambda.NodejsFunction;

  constructor(scope: Construct, id: string, resources: LambdaResources) {
    const { vpc, apiGateway } = resources;

    super(scope, id);

    this.handler = new lambda.NodejsFunction(this, 'CreativeLibrary', {
      functionName: `creativeLibrary-${config.stage}`,
      runtime: Runtime.NODEJS_18_X,
      entry: './src/creativeLibrary/handler.ts',
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
      'CreativeLibraryIntegration',
      this.handler,
    );

    apiGateway.addRoutes({
      path: '/creative-libraries',
      methods: [HttpMethod.ANY],
      integration: lambdaIntegration,
    });
  }
}
