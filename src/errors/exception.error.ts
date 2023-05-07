import type { Request, Response } from 'express';

import type { LoggerService } from '../logger/logger.service';
import type { ExceptionErrorModel } from './exceptionError.interface';
import { HttpError } from './http-error';

export class ExceptionError implements ExceptionErrorModel {
  constructor(public logger: LoggerService) {}

  catch(err: Error | HttpError, req: Request, res: Response): void {
    if (err instanceof HttpError) {
      this.logger.error(`[${err.context ?? ''}] Error: ${err.status} ${err.message}`);
      res.status(err.status).json({ message: 'Internal Server Error' });
    } else {
      this.logger.error(err.message, err.stack);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}
