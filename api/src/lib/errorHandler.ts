import {NextFunction, Request, Response} from 'express';
import {ValidateError} from 'tsoa';
import {AuthError} from '../authentication';
import logger from '../logger';
import type {UnauthorizedErrorModel} from 'shared-types';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): Response | void {
  if (err instanceof ValidateError) {
    logger.warn(`Caught Validation Error for ${req.path}:`, err.fields);
    return res.status(422).json({
      message: 'Validation Failed',
      details: err?.fields,
    });
  }

  if (err instanceof AuthError) {
    const response: UnauthorizedErrorModel = {
      reason: err.message
    };

    return res.status(401).json(response);
  }

  next();
}
