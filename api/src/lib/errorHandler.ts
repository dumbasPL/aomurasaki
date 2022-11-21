import {NextFunction, Request, Response} from 'express';
import {ValidateError} from 'tsoa';
import logger from '../logger';
import type {BadRequestErrorModel, ForbiddenErrorModel, InternalServerErrorModel, UnauthorizedErrorModel} from 'shared-types';

export class AuthError extends Error {}
export class BadRequestError extends Error {};
export class ForbiddenError extends Error {};

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): Response | void {
  if (err instanceof ValidateError) {
    logger.warn(`Caught Validation Error for ${req.path}:`, err.fields);
    return res.status(422).json({
      message: 'Validation Failed',
      details: err?.fields,
    }); // FIXME: satisfies
  }

  if (err instanceof BadRequestError) {
    return res.status(400).json({
      message: err.message,
    } satisfies BadRequestErrorModel);
  }

  if (err instanceof AuthError) {
    return res.status(401).json({
      reason: err.message
    } satisfies UnauthorizedErrorModel);
  }

  if (err instanceof ForbiddenError) {
    return res.status(403).json({
      reason: err.message
    } satisfies ForbiddenErrorModel);
  }

  logger.error(err);

  if (err instanceof Error) {
    return res.status(500).json({
      message: err.message,
      stack: err.stack?.split('\n'),
    } as InternalServerErrorModel);
  }

  return res.status(500).json({
    message: 'Internal server error',
  } as InternalServerErrorModel);
}
