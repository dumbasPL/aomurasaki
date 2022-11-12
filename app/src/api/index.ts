import { DefaultApi, UserApi } from "api-client";

export function useUserApi() {
  // TODO: add token support
  return new UserApi();
}

export function useDefaultApi() {
  return new DefaultApi();
}