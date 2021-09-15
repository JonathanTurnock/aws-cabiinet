import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { StatusCodes, getReasonPhrase } from "http-status-codes";
import { errorLogger, formatJsonResponse } from "../../utils/interceptor";
import { pipe } from "lodash/fp";

export const handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  const statusCode =
    Number(event.queryStringParameters?.statusCode) || StatusCodes.BAD_REQUEST;

  const response = {
    statusCode,
    body: {
      code: statusCode,
      status: getReasonPhrase(statusCode),
    },
  };

  return pipe(errorLogger, formatJsonResponse)(response);
};
