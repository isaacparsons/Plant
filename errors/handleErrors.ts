import { errorResponseFormat } from "../utils/response";

function handleNrgError(error: any, req: any, res: any, next: any) {
  if (error.name === "NrgError") {
    return res.status(400).json(errorResponseFormat(error.message));
  }
  next(error);
}

function handleAdamsError(error: any, req: any, res: any, next: any) {
  if (error.name === "AdamsError") {
    return res.status(400).json(errorResponseFormat(error.message));
  }
  next(error);
}

function handleRequestError(error: any, req: any, res: any, next: any) {
  if (error.name === "RequestError") {
    return res.status(400).json(errorResponseFormat(error.message));
  }
  next(error);
}

function validationError(error: any, req: any, res: any, next: any) {
  if (error.name == "ValidationError") {
    return res.status(400).json(errorResponseFormat(error.errorMsg));
  }
  if (error.name == "CastError") {
    return res.status(400).json(errorResponseFormat(error.errorMsg));
  }
  next(error);
}

function handleError(error: any, req: any, res: any, next: any) {
  if (error instanceof Error) {
    return res.status(400).json(errorResponseFormat(error.message));
  }
  next(error);
}

export const errorMiddleware = [
  handleNrgError,
  handleAdamsError,
  handleRequestError,
  validationError,
  handleError,
];
