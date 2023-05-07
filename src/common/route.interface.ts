import type { IRoute, NextFunction, Request, Response } from 'express';

type HTTPMethodsModel = keyof Pick<IRoute, 'get' | 'post' | 'put' | 'delete' | 'patch'>;
export interface RouteModel {
  path: string;
  func(req: Request, res: Response, next: NextFunction): void;
  method: HTTPMethodsModel;
}
