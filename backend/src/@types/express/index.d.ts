import {loginResponse} from "../../interfaces/AuthInterfaces";

declare global {
  namespace Express {
    interface Request {
      user?: loginResponse;
    }
  }
}

export {};
