import { HttpError } from "../errors/http-error.js";

export const toErrorResponse = (error: unknown) => {
  if (error instanceof HttpError) {
    return {
      status: error.status,
      body: {
        error: {
          code: error.code,
          message: error.message
        }
      }
    };
  }

  return {
    status: 500,
    body: {
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Unexpected error"
      }
    }
  };
};
