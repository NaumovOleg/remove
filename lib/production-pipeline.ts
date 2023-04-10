import * as cdk from 'aws-cdk-lib';
import { CodePipeline } from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import { config } from 'node-config-ts';

import { Stage } from './stage';
import { SynthStep } from './synth';

export class ProductionPipeline extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const repo = cdk.aws_codecommit.Repository.fromRepositoryName(this, 'Repo', config.repositoryName);

    const pipeline = new CodePipeline(this, 'skyrise-pipeline-production', {
      pipelineName: 'skyrise-be-production',
      selfMutation: true,
      synth: new SynthStep(repo, config.branch),
    });

    pipeline.addStage(new Stage(this, config.stage));
  }
}
