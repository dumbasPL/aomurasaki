import express from 'express';
import jwt from 'jsonwebtoken';
import User, {UserDto} from './Entities/User';
import {APP_SECRET} from './env';
import {mapper} from './mapper';

export class AuthError extends Error {}

export async function expressAuthentication(
  request: express.Request,
  securityName: string,
  scopes?: string[]
): Promise<Exclude<express.Request['user'], undefined>> {
  if (securityName === 'api_key') {
    const apiKey = request.headers['x-api-key'] || request.query?.api_key;
    if (!apiKey) {
      throw new AuthError('Api key missing');
    }

    throw new AuthError('Not implemented');
  }

  if (securityName === 'jwt') {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new AuthError('Authorization header missing');
    }

    const [scheme, token] = authHeader.split(' ');
    if (scheme != 'Bearer') {
      throw new AuthError('Invalid authorization scheme');
    }

    const decoded = jwt.verify(token, APP_SECRET);

    if (typeof decoded == 'string') {
      throw new AuthError('Invalid token body');
    }

    const userId = +(decoded.sub ?? '');
    const securityStamp = decoded.ss;
    if (isNaN(userId) || typeof securityStamp !== 'string') {
      throw new AuthError('Invalid token body');
    }

    const user = await User.findByPk(userId, {
      attributes: {
        include: ['securityStamp'],
      },
    }).catch(err => {
      console.error(err);
      throw new AuthError('Unable to find user');
    });

    if (user == null) {
      throw new AuthError('User not found');
    }

    if (user.securityStamp! !== securityStamp) {
      throw new AuthError('Invalid security stamp');
    }

    return mapper.map(user, User, UserDto);
  }

  throw new Error('unsupported securityName');
}
