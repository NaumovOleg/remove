import { HttpApi, HttpMethod } from '@aws-cdk/aws-apigatewayv2-alpha';
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import { CfnDeployment, CfnStage } from 'aws-cdk-lib/aws-apigatewayv2';
import { Construct } from 'constructs';
import { config } from 'node-config-ts';

import { ApiHandler } from '../types';

const { NODE_ENV } = config;

export class HttpApiGateway extends Construct {
  httpApi: HttpApi;

  stage: CfnStage;

  deploy: CfnDeployment;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.httpApi = new HttpApi(this, 'skyrise-api', {
      description: 'Skyrise Http Api',
    });

    this.stage = new CfnStage(this, 'Stage', {
      apiId: this.httpApi.apiId,
      stageName: NODE_ENV,
      // autoDeploy: true,
    });

    // this.deploy = new CfnDeployment(this, `skyrise-api-deploy-${NODE_ENV}`, {
    //   apiId: this.httpApi.apiId,
    //   stageName: this.stage.stageName,
    // });
  }

  public setRoute(path: string, handler: ApiHandler) {
    const integration = new HttpLambdaIntegration(
      `Integration${handler.functionName}`,
      handler.handler,
    );

    this.httpApi.addRoutes({ path, integration, methods: [HttpMethod.ANY] });
  }
}
