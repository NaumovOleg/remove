import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { config } from 'node-config-ts';

export class CreativeLibraryFunctionConstruct extends Construct {
  handler: lambda.NodejsFunction;

  functionName: string;

  constructor(scope: Construct, id: string, vpc: ec2.Vpc) {
    super(scope, id);

    this.functionName = `creativeLibrary-${config.stage}`;

    this.handler = new lambda.NodejsFunction(this, 'CreativeLibrary', {
      functionName: this.functionName,
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
  }
}
