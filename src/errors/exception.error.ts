import type { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import 'reflect-metadata';
import { LoggerServiceModel } from '../logger/logger.interface.js';
import { TYPES } from '../types/types.js';
import type { ExceptionErrorModel } from './exceptionError.interface.js';
import { HttpError } from './http-error.js';

@injectable()
export class ExceptionError implements ExceptionErrorModel {
  constructor(@inject(TYPES.LoggerServiceModel) private logger: LoggerServiceModel) {}

  catch(err: Error | HttpError, req: Request, res: Response, _: NextFunction): void {
    if (err instanceof HttpError) {
      this.logger.error(`[${err.context ?? ''}] Error: ${err.status} ${err.message}`);
      res.status(err.status).json({ message: err.message });
    } else {
      this.logger.error(err.message, err.stack);
      res.status(500).json({ message: 'Internal Server Error' });
    }

    console.log(_);
  }
}
