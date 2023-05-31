import type { Response } from 'express';
import { Router } from 'express';
import { injectable } from 'inversify';

import 'reflect-metadata';
import { LoggerServiceModel } from '../logger/logger.interface.js';
import type { RouteModel } from './route.interface.js';

@injectable()
export abstract class BaseController {
  private readonly _router: Router;

  constructor(protected logger: LoggerServiceModel) {
    this._router = Router();
  }

  get router(): Router {
    return this._router;
  }

  protected bindRoutes(routes: RouteModel[]): void {
    routes.forEach((route) => {
      this.logger.log(`Binding route ${route.method.toUpperCase()} ${route.path}`);
      const middlewares = route.middlewares?.map((m) => m.execute.bind(m));
      this.router[route.method](route.path, ...(middlewares || []), route.func.bind(this));
    });
  }

  ok<T>(res: Response, dto?: T): Response<T> {
    return !!dto ? res.status(200).json(dto) : res.sendStatus(200);
  }

  created(res: Response): Response {
    return res.sendStatus(201);
  }
}
