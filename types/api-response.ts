import { APIGatewayProxyResult } from "aws-lambda";

export type ApiResponse = Omit<APIGatewayProxyResult, "body"> & { body: any };
