import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { HttpApiGateway } from './resources/api-gateway';
import { CreativeLibraryFunctionConstruct, MediaPlanFunctionConstruct } from './resources/lambda';
import { VpcConstruct } from './resources/vpc';

export class SkyriseStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const VPC = new VpcConstruct(this, 'Vpc');
    const apiGateway = new HttpApiGateway(this, 'ApiGateway');

    const lambdaResources = {
      vpc: VPC.vpc,
      apiGateway: apiGateway.httpApi,
    };

    new MediaPlanFunctionConstruct(this, 'MediaPlanFunc', lambdaResources);
    new CreativeLibraryFunctionConstruct(this, 'CreativeLibraryFunc', lambdaResources);
  }
}
