export class ApiError extends Error {
  public readonly statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);

    this.name = "ApiError";
    this.statusCode = statusCode;

    Object.setPrototypeOf(this, ApiError.prototype);
  }
}