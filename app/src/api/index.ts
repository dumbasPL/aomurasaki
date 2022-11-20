import {Configuration, DefaultApi, UserApi} from 'api-client';
import axios, {AxiosError} from 'axios';
import UnauthorizedError from './errors/UnauthorizedError';
import type {UnauthorizedErrorModel} from 'shared-types';
import ApiError from './errors/ApiError';

axios.interceptors.response.use(undefined, error => Promise.reject(((): Error => {
  if (error instanceof AxiosError && error.response) {
    switch (error.response.status) {
    case 401:
      return new UnauthorizedError((error.response.data as UnauthorizedErrorModel).reason);
    default:
      return new ApiError(error.message, error.response.status);
    }
  }
  return error;
})()));

const getConfiguration = () => new Configuration({
  accessToken: window.localStorage.getItem('token') ?? undefined,
});

export const useUserApi = (clean: boolean = false) => new UserApi(clean ? undefined : getConfiguration());

export const useDefaultApi = () => new DefaultApi(getConfiguration());
