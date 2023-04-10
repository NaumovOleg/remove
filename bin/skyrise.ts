#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { config } from 'node-config-ts';
import 'source-map-support/register';

import { DevelopmentPipeline } from '../lib/develop-pipeline';
// import { ProductionPipeline } from '../lib/production-pipeline';
import { CodeCommit } from '../lib/code-сommit';

if (!process.env.DEPLOYMENT || !process.env.NODE_ENV) {
  throw new Error('Env error');
}

const app = new cdk.App();
new CodeCommit(app, 'CodeCommit');
new DevelopmentPipeline(app, 'SkyriseDevelopment', { env: config.StackEnv });
// new ProductionPipeline(app, 'SkyriseProduction', { env: config.StackEnv });

app.synth();
