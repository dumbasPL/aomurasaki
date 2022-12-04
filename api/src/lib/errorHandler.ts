import {NextFunction, Request, Response} from 'express';
import {ValidateError} from 'tsoa';
import logger from '../logger';
import type {BadRequestErrorModel, ForbiddenErrorModel, InternalServerErrorModel, NotFoundErrorModel, UnauthorizedErrorModel} from 'shared-types';
import {i18n, TOptions} from 'i18next';

interface TranslatedErrorOptions extends ErrorOptions {
  t?: string | string[]
  tOpt?: TOptions;
}

export class TranslatedError extends Error {

  t?: string | string[];
  tOpt?: TOptions;

  constructor(message?: string, options?: TranslatedErrorOptions) {
    super(message, options);
    this.t = options?.t;
    this.tOpt = options?.tOpt;
  }

  getTranslatedMessage(i18n: i18n): string {
    if (this.t) {
      return i18n.t(this.t, this.tOpt) ?? this.message;
    }
    return this.message;
  }

}

export class AuthError extends TranslatedError {}
export class BadRequestError extends TranslatedError {};
export class ForbiddenError extends TranslatedError {};
export class NotFoundError extends TranslatedError {};

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
      message: err.getTranslatedMessage(req.i18n),
    } satisfies BadRequestErrorModel);
  }

  if (err instanceof AuthError) {
    return res.status(401).json({
      reason: err.getTranslatedMessage(req.i18n),
    } satisfies UnauthorizedErrorModel);
  }

  if (err instanceof ForbiddenError) {
    return res.status(403).json({
      reason: err.getTranslatedMessage(req.i18n),
    } satisfies ForbiddenErrorModel);
  }

  if (err instanceof NotFoundError) {
    return res.status(404).json({
      message: err.getTranslatedMessage(req.i18n),
    } satisfies NotFoundErrorModel);
  }

  logger.error(err);

  if (err instanceof Error) {
    return res.status(500).json({
      message: err instanceof TranslatedError ? err.getTranslatedMessage(req.i18n) : err.message,
      stack: err.stack?.split('\n'),
    } as InternalServerErrorModel);
  }

  return res.status(500).json({
    message: req.i18n.t('errors.internalServerError', {defaultValue: 'Internal server error'}),
  } as InternalServerErrorModel);
}
