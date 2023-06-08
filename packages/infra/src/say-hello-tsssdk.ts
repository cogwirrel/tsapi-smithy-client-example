import { ApiError, getSayHelloHandler } from 'smithy-ts-server';
import { getApiGatewayHandler } from './apigateway';

export const handler = getApiGatewayHandler(getSayHelloHandler(async (input) => {
  if (input.name === 'error') {
    throw new ApiError({ errorMessage: 'Oh no!' });
  }
  return {
    message: `Hello ${input.name}!`,
  };
}));
