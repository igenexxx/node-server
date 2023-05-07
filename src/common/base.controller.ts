import type { Response } from 'express';
import { Router } from 'express';

import type { LoggerService } from '../logger/logger.service';
import type { RouteModel } from './route.interface';

export abstract class BaseController {
  private readonly _router: Router;

  protected constructor(protected logger: LoggerService) {
    this._router = Router();
  }

  get router(): Router {
    return this._router;
  }

  protected bindRoutes(routes: RouteModel[]): void {
    routes.forEach((route) => {
      this.logger.log(`Binding route ${route.method.toUpperCase()} ${route.path}`);
      this.router[route.method](route.path, route.func.bind(this));
    });
  }

  ok<T>(res: Response, dto?: T): Response<T> {
    return !!dto ? res.status(200).json(dto) : res.sendStatus(200);
  }

  created(res: Response): Response {
    return res.sendStatus(201);
  }
}
