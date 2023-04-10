import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { HttpApiGateway } from './resources/api-gateway';
import { CreativeLibraryFunctionConstruct, MediaPlanFunctionConstruct } from './resources/lambda';
import { VpcConstruct } from './resources/vpc';

export class SkyriseStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const { vpc } = new VpcConstruct(this, 'Vpc');

    const mediaPlans = new MediaPlanFunctionConstruct(this, 'MediaPlanFunc', vpc);
    const creativeLibraries = new CreativeLibraryFunctionConstruct(this, 'CreativeLibraryFunc', vpc);

    const apiGateway = new HttpApiGateway(this, 'ApiGateway');

    apiGateway.setRoute('/creative-libraries', creativeLibraries);
    apiGateway.setRoute('/media-plans', mediaPlans);
  }
}
