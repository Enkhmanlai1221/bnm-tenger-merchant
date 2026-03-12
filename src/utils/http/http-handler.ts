export interface ErrorMessage {
  code: string;
  error: string | JoiError;
  message: string;
}

export interface JoiError {
  [key: string]: {
    type: string;
    message: string;
  };
}

export class HttpHandler {
  statusCode: number;
  code: string | undefined;
  error: string | JoiError | undefined;
  message: string | undefined;
  payload: any | undefined;

  constructor(statusCode: number, errorMessage?: ErrorMessage) {
    const { code, error, message, ...rest } = errorMessage || {};
    this.statusCode = statusCode;
    this.code = code;

    if (code === "JoiValidationError") {
      try {
        this.error = JSON.parse(error as string);
      } catch (err) {
        this.error = error as string;
      }
    } else {
      this.error = error as string;
    }

    this.message = message;
    this.payload = rest;
  }

  async handle(res: Response) {
    let data;

    try {
      try {
        data = await res.json();
      } catch (err) {
        data = {
          message: await res.text(),
          code: "CLIENT_ERROR",
          error: "ClientError",
        };
      }
    } catch (err) {
      data = {
        message: "Internet connection error!",
        code: "NETWORK_ERROR",
        error: "NetworkError",
      };
    }

    switch (this.statusCode) {
      case 200:
      case 304:
        return data;
      default:
        throw new HttpHandler(this.statusCode, data);
    }
  }
}

export default HttpHandler;
