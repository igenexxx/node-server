import type { IRoute, NextFunction, Request, Response } from 'express';

import type { MiddlewareModel } from './middleware.interface.js';

type HTTPMethodsModel = keyof Pick<IRoute, 'get' | 'post' | 'put' | 'delete' | 'patch'>;
export interface RouteModel {
  path: string;
  func(req: Request, res: Response, next: NextFunction): void;
  method: HTTPMethodsModel;
  middlewares?: MiddlewareModel[];
}
