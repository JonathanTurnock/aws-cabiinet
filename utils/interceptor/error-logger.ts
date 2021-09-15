import { ApiResponse } from "../../types/api-response";

export const errorLogger = (response: ApiResponse): ApiResponse => {
  if (response.statusCode !== 200) {
    console.error(JSON.stringify(response));
  } else {
    console.debug(JSON.stringify(response));
  }
  return response;
};
