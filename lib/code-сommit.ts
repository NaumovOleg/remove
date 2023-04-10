import { Repository, IRepository } from 'aws-cdk-lib/aws-codecommit';
import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { config } from 'node-config-ts';

export class CodeCommit extends Stack {
  readonly repository: IRepository;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.repository = new Repository(this, 'Repository', { repositoryName: config.repositoryName });
  }
}
