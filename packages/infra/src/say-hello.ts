import { sayHelloHandler } from 'myapi-typescript-runtime';

export const handler = sayHelloHandler(async ({ input }) => {
  // for testing how the smithy client handles errors
  if (input.requestParameters.name === 'error') {
    return {
      statusCode: 400,
      body: {
        errorMessage: 'Oh no!',
      },
    };
  }
  return {
    statusCode: 200,
    body: {
      message: `Hello ${input.requestParameters.name}!`,
    },
  };
});
