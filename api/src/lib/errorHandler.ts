import {NextFunction, Request, Response} from 'express';
import {ValidateError} from 'tsoa';
import {AuthError} from '../authentication';
import logger from '../logger';
import type {BadRequestErrorModel, UnauthorizedErrorModel} from 'shared-types';

export class BadRequestError extends Error {};

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): Response | void {
  if (err instanceof ValidateError) {
    logger.warn(`Caught Validation Error for ${req.path}:`, err.fields);
    return res.status(422).json({
      message: 'Validation Failed',
      details: err?.fields,
    });
  }

  if (err instanceof BadRequestError) {
    const response: BadRequestErrorModel = {
      message: err.message,
    };

    return res.status(400).json(response);
  }

  if (err instanceof AuthError) {
    const response: UnauthorizedErrorModel = {
      reason: err.message
    };

    return res.status(401).json(response);
  }

  next();
}
