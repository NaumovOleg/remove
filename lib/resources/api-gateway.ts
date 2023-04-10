import { HttpApi } from '@aws-cdk/aws-apigatewayv2-alpha';
import { Construct } from 'constructs';
import { config } from 'node-config-ts';
import { CfnDeployment } from 'aws-cdk-lib/aws-apigatewayv2';

export class HttpApiGateway extends Construct {
  httpApi: HttpApi;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.createHttpApi();
    this.addStages();
    this.addDeployment();
  }

  private createHttpApi() {
    this.httpApi = new HttpApi(this, 'skyrise-api', {
      description: 'Skyrise Http Api',
    });
  }

  private addStages() {
    const { NODE_ENV } = config;

    this.httpApi.addStage(NODE_ENV, { stageName: NODE_ENV });
  }

  private addDeployment() {
    const { NODE_ENV } = config;

    new CfnDeployment(this, `skyrise-api-deploy-${NODE_ENV}`, {
      apiId: this.httpApi.apiId,
      stageName: NODE_ENV,
    });
  }
}
