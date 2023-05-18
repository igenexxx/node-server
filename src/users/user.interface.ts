import type { NextFunction, Request, Response } from 'express';

export interface UserControllerModel {
  login(_: Request, res: Response, next: NextFunction): void;

  register(_: Request, res: Response): void;
}
