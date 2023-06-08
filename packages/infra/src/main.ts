import * as path from 'path';
import { Authorizers, Integrations } from '@aws-prototyping-sdk/type-safe-api';
import { App, Stack, StackProps } from 'aws-cdk-lib';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { Api } from 'myapi-typescript-infra';

export class MyStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    new Api(this, 'Api', {
      defaultAuthorizer: Authorizers.iam(),
      integrations: {
        sayHello: {
          integration: Integrations.lambda(new NodejsFunction(this, 'SayHelloLambda', {
            entry: path.join(__dirname, 'say-hello-tsssdk.ts'),
            bundling: {
              nodeModules: ['re2-wasm'],
            },
          })),
        },
      },
    });
  }
}

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new MyStack(app, 'smithymcsmithytest-dev', { env: devEnv });
// new MyStack(app, 'myinfra-prod', { env: prodEnv });

app.synth();