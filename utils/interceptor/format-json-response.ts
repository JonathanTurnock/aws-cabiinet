import { APIGatewayProxyResult } from "aws-lambda";
import { ApiResponse } from "../../types/api-response";

export const formatJsonResponse = (
  response: ApiResponse | APIGatewayProxyResult
): APIGatewayProxyResult => ({
  ...response,
  headers: {
    ...response.headers,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(response.body),
});
