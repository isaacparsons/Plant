export class AdamsError extends Error {
  constructor(message: any) {
    super(message);
    this.name = "AdamsError";
  }
}
export class NrgError extends Error {
  constructor(message: any) {
    super(message);
    this.name = "NrgError";
  }
}

export class RequestError extends Error {
  constructor(message: any) {
    super(message);
    this.name = "RequestError";
  }
}
