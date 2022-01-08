export class RequestError extends Error {
  constructor(message: any) {
    super(message);
    this.name = "RequestError";
  }
}
