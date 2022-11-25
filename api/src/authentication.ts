import express from 'express';
import jwt from 'jsonwebtoken';
import {Permissions} from 'shared-types';
import User, {UserDto} from './Entities/User';
import {APP_SECRET} from './env';
import {AuthError, ForbiddenError} from './lib/errorHandler';
import {mapper} from './mapper';
import {isJWTModel} from './Models/JWTModel';

type Unpacked<T> = T extends (infer U)[] ? U : T;

const PermissionScopes = {
  active: Permissions.Active,
  admin: Permissions.Admin,
} satisfies Record<Lowercase<keyof typeof Permissions>, Permissions>;

export const PermissionScopeStrings = {
  active: 'active',
  admin: 'admin',
} satisfies {[K in keyof typeof PermissionScopes]: K};

const scopeList = Object.values(PermissionScopeStrings);
type Scope = Unpacked<typeof scopeList>;

function isValidScopes(scopes?: string[]): scopes is Scope[] {
  return Array.isArray(scopes) &&
    scopes.every(scope => (scopeList as string[]).includes(scope));
}

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

    if (!isJWTModel(decoded)) {
      throw new AuthError('Invalid token body');
    }

    const user = await User.findByPk(+decoded.sub, {
      attributes: {
        include: ['securityStamp', 'permissions'],
      },
    }).catch(err => {
      console.error(err);
      throw new AuthError('Unable to find user');
    });

    if (user == null) {
      throw new AuthError('User not found');
    }

    if (user.securityStamp! !== decoded.ss) {
      throw new AuthError('Invalid security stamp');
    }

    if (!user.hasPermission(Permissions.Active)) {
      throw new AuthError('User is disabled');
    }

    if (isValidScopes(scopes)) {
      const neededPermissions = scopes.map(scope => PermissionScopes[scope]).reduce((prev, cur) => prev | cur, 0);

      // require at least one permission to be present
      if (neededPermissions !== 0 && (neededPermissions & decoded.perm) === 0) {
        throw new ForbiddenError('Missing permissions');
      }
    }

    return mapper.map(user, User, UserDto);
  }

  throw new Error('unsupported securityName');
}
