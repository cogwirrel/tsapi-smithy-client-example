import * as path from "path";
import { NxMonorepoProject } from "@aws-prototyping-sdk/nx-monorepo";
import {
  DocumentationFormat,
  Language,
  Library,
  ModelLanguage,
  TypeSafeApiProject,
} from "@aws-prototyping-sdk/type-safe-api";
import { AwsCdkTypeScriptApp } from "projen/lib/awscdk";
import { TypeScriptProject } from "projen/lib/typescript";

// Create the monorepo
const monorepo = new NxMonorepoProject({
  name: "tsapi-smithy-client-example",
  defaultReleaseBranch: "main",
  devDeps: [
    "@aws-prototyping-sdk/nx-monorepo",
    "@aws-prototyping-sdk/type-safe-api",
  ],
  gitignore: [".idea", "*.iml"],
});

// Create the API project
const api = new TypeSafeApiProject({
  name: "myapi",
  parent: monorepo,
  outdir: "packages/api",
  // Smithy as the model language. You can also use ModelLanguage.OPENAPI
  model: {
    language: ModelLanguage.SMITHY,
    options: {
      smithy: {
        serviceName: {
          namespace: "com.my.company",
          serviceName: "MyApi",
        },
        smithyBuildOptions: {
          projections: {
            "smithy-ts-client": {
              plugins: {
                "typescript-codegen": {
                  package: "smithy-ts-client",
                  packageVersion: "0.0.1",
                },
              },
            },
            "ts-server" : {
              "plugins": {
                "typescript-ssdk-codegen" : {
                  "package" : "smithy-ts-server",
                  "packageVersion": "0.0.1"
                }
              }
            },
          },
          maven: {
            dependencies: [
              "software.amazon.smithy.typescript:smithy-aws-typescript-codegen:0.12.0",
              "software.amazon.smithy:smithy-validation-model:1.28.0",
            ],
          },
        },
      },
    },
  },
  // Generate types, client and server code in TypeScript, Python and Java
  runtime: {
    languages: [Language.TYPESCRIPT],
  },
  // CDK infrastructure in TypeScript
  infrastructure: {
    language: Language.TYPESCRIPT,
  },
  // Generate HTML documentation
  documentation: {
    formats: [DocumentationFormat.HTML_REDOC],
  },
  // Generate react-query hooks to interact with the UI from a React website
  library: {
    libraries: [Library.TYPESCRIPT_REACT_QUERY_HOOKS],
  },
});

const smithyClient = new TypeScriptProject({
  parent: monorepo,
  outdir: "packages/smithy-ts-client",
  name: "smithy-ts-client",
  defaultReleaseBranch: "main",
  sampleCode: false,
  deps: [
    "tslib",
    "@aws-crypto/sha256-browser@2.0.0",
    "@aws-crypto/sha256-js@2.0.0",
    "@aws-sdk/client-sts@3.171.0",
    "@aws-sdk/config-resolver@3.171.0",
    "@aws-sdk/credential-provider-node@3.171.0",
    "@aws-sdk/fetch-http-handler@3.171.0",
    "@aws-sdk/hash-node@3.171.0",
    "@aws-sdk/invalid-dependency@3.171.0",
    "@aws-sdk/middleware-content-length@3.171.0",
    "@aws-sdk/middleware-host-header@3.171.0",
    "@aws-sdk/middleware-logger@3.171.0",
    "@aws-sdk/middleware-recursion-detection@3.171.0",
    "@aws-sdk/middleware-retry@3.171.0",
    "@aws-sdk/middleware-serde@3.171.0",
    "@aws-sdk/middleware-signing@3.171.0",
    "@aws-sdk/middleware-stack@3.171.0",
    "@aws-sdk/middleware-user-agent@3.171.0",
    "@aws-sdk/node-config-provider@3.171.0",
    "@aws-sdk/node-http-handler@3.171.0",
    "@aws-sdk/protocol-http@3.171.0",
    "@aws-sdk/smithy-client@3.171.0",
    "@aws-sdk/types@3.171.0",
    "@aws-sdk/url-parser@3.171.0",
    "@aws-sdk/util-base64-browser@3.170.0",
    "@aws-sdk/util-base64-node@3.170.0",
    "@aws-sdk/util-body-length-browser@3.170.0",
    "@aws-sdk/util-body-length-node@3.170.0",
    "@aws-sdk/util-defaults-mode-browser@3.171.0",
    "@aws-sdk/util-defaults-mode-node@3.171.0",
    "@aws-sdk/util-user-agent-browser@3.171.0",
    "@aws-sdk/util-user-agent-node@3.171.0",
    "@aws-sdk/util-utf8-browser@3.170.0",
    "@aws-sdk/util-utf8-node@3.170.0",
  ],
  eslint: false,
  tsconfig: {
    compilerOptions: {
      lib: ["dom", "es2019"],
      noUnusedParameters: false,
      noUnusedLocals: false,
      noImplicitReturns: false,
    },
  },
});

// Make sure smithy client builds after model
monorepo.addImplicitDependency(smithyClient, api.model);
smithyClient.preCompileTask.exec("rm -rf src");
smithyClient.preCompileTask.exec(
  `cp -r ${path.join(
    path.relative(smithyClient.outdir, api.model.outdir),
    "build",
    "smithyprojections",
    "myapi-model",
    "smithy-ts-client",
    "typescript-codegen",
    "src"
  )} src`
);
smithyClient.gitignore.addPatterns("src");


const smithyServerSdk = new TypeScriptProject({
  parent: monorepo,
  outdir: "packages/smithy-ts-server",
  name: "smithy-ts-server",
  defaultReleaseBranch: "main",
  sampleCode: false,
  deps: [
    "tslib",
    "@aws-crypto/sha256-browser@2.0.0",
    "@aws-crypto/sha256-js@2.0.0",
    "@aws-sdk/config-resolver@3.171.0",
    "@aws-sdk/fetch-http-handler@3.171.0",
    "@aws-sdk/hash-node@3.171.0",
    "@aws-sdk/invalid-dependency@3.171.0",
    "@aws-sdk/middleware-content-length@3.171.0",
    "@aws-sdk/middleware-retry@3.171.0",
    "@aws-sdk/middleware-serde@3.171.0",
    "@aws-sdk/middleware-stack@3.171.0",
    "@aws-sdk/node-http-handler@3.171.0",
    "@aws-sdk/protocol-http@3.171.0",
    "@aws-sdk/smithy-client@3.171.0",
    "@aws-sdk/types@3.171.0",
    "@aws-sdk/url-parser@3.171.0",
    "@aws-sdk/util-base64-browser@3.170.0",
    "@aws-sdk/util-base64-node@3.170.0",
    "@aws-sdk/util-body-length-browser@3.170.0",
    "@aws-sdk/util-body-length-node@3.170.0",
    "@aws-sdk/util-defaults-mode-browser@3.171.0",
    "@aws-sdk/util-defaults-mode-node@3.171.0",
    "@aws-sdk/util-utf8-browser@3.170.0",
    "@aws-sdk/util-utf8-node@3.170.0",
    "@aws-smithy/server-common@1.0.0-alpha.6",
  ],
  eslint: false,
  tsconfig: {
    compilerOptions: {
      lib: ["dom", "es2019"],
      noUnusedParameters: false,
      noUnusedLocals: false,
      noImplicitReturns: false,
    },
  },
});

// Make sure smithy client builds after model
monorepo.addImplicitDependency(smithyServerSdk, api.model);
smithyServerSdk.preCompileTask.exec("rm -rf src");
smithyServerSdk.preCompileTask.exec(
  `cp -r ${path.join(
    path.relative(smithyServerSdk.outdir, api.model.outdir),
    "build",
    "smithyprojections",
    "myapi-model",
    "ts-server",
    "typescript-ssdk-codegen",
    "src"
  )} src`
);
smithyServerSdk.gitignore.addPatterns("src");

new TypeScriptProject({
  parent: monorepo,
  name: "caller-example",
  outdir: "packages/caller-example",
  defaultReleaseBranch: "main",
  deps: [
    smithyClient.package.packageName,
  ],
  tsconfig: {
    compilerOptions: {
      lib: ['dom', 'es2019'],
      skipLibCheck: true,
    },
  },
});

// Create a CDK infrastructure project. Can also consider PDKPipelineTsProject as an alternative!
const infra = new AwsCdkTypeScriptApp({
  defaultReleaseBranch: "main",
  cdkVersion: "2.0.0",
  parent: monorepo,
  outdir: "packages/infra",
  name: "myinfra",
  deps: [
    "@aws-prototyping-sdk/type-safe-api",
    smithyServerSdk.package.packageName,
    "@aws-smithy/server-common@1.0.0-alpha.6",
    "@aws-smithy/server-apigateway@1.0.0-alpha.6",
  ],
  devDeps: [
    "@types/aws-lambda",
  ],
});

// Infrastructure can depend on the generated API infrastructure and runtime
infra.addDeps(api.infrastructure.typescript!.package.packageName);
infra.addDeps(api.runtime.typescript!.package.packageName);

monorepo.synth();
