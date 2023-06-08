import { convertEvent, convertVersion1Response } from '@aws-smithy/server-apigateway';
import { ServiceHandler } from '@aws-smithy/server-common';
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import type { APIGatewayProxyHandler } from 'aws-lambda/trigger/api-gateway-proxy';

// COPIED SHAMELESSLY FROM: https://github.com/aws-samples/smithy-server-generator-typescript-sample/blob/main/server/src/apigateway.ts

/**
 * Defines anything the operation handler needs that is not modeled in the operation's Smithy model but comes from
 * other context
 */
export interface HandlerContext {
  user: string;
}

/**
 * Given a ServiceHandler, returns an APIGatewayProxyHandler that knows how to:
 * 1. convert the APIGateway request (APIGatewayProxyEvent) into inputs for the ServiceHandler
 * 2. invoke the ServiceHandler
 * 3. convert the output of ServiceHandler into the result (APIGatewayProxyResult) expected by APIGateway
 */
export function getApiGatewayHandler(handler: ServiceHandler<HandlerContext>): APIGatewayProxyHandler {
  return async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Extract anything from the APIGateway requestContext that you'd need in your operation handler
    const userArn = event.requestContext.identity.userArn;
    if (!userArn) {
      throw new Error('IAM Auth is not enabled');
    }
    const context = { user: userArn };

    const httpRequest = convertEvent(event);
    const httpResponse = await handler.handle(httpRequest, context);
    return convertVersion1Response(httpResponse);
  };
}