import {Permissions} from 'shared-types';
import {enumObject, enumObjectReverse} from './enums';

export const permissions = enumObjectReverse(Permissions);
export const permissionsEntries = Object.entries(enumObject(Permissions)) as [keyof typeof Permissions, Permissions][];
export const permissionValues = Object.keys(permissions).map(x => +x);

export function decodePermissions(value: number) {
  return permissionValues.filter(val => (value & val) == val).map(perm => Permissions[perm]);
}
