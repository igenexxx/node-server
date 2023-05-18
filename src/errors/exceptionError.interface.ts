import type { NextFunction, Request, Response } from 'express';

import type { HttpError } from './http-error.js';

export interface ExceptionErrorModel {
  catch(err: Error | HttpError, req: Request, res: Response, next: NextFunction): void;
}
