import {useUserApi} from '@/api';
import type {LoginModel, UserDto} from 'api-client';
import {defineStore} from 'pinia';

interface State {
  token: string | null,
  user: UserDto | null,
}

export const useUserStore = defineStore('user', {
  state: (): State => ({
    token: window.localStorage.getItem('token'),
    user: null,
  }),
  getters: {
    hasToken: state => state.token != null,
    isLoggedIn: state => state.user != null,
  },
  actions: {
    setToken(token: string | null) {
      this.token = token;
      if (token) {
        window.localStorage.setItem('token', token);
      } else {
        window.localStorage.removeItem('token');
      }
    },
    async fetchUserInfo(): Promise<UserDto | null> {
      const userApi = useUserApi();
      try {
        const {data} = await userApi.getUserInfo();
        return this.user = data;
      } catch (error) {
        this.user = null;
        return null;
      }
    },
    async login(model: LoginModel): Promise<UserDto> {
      const userApi = useUserApi(true);
      const {data} = await userApi.login(model);
      this.setToken(data.token);
      return this.user = data.user;
    },
    async changePassword(currentPassword: string, newPassword: string) {
      const userApi = useUserApi();
      const {data} = await userApi.changePassword({currentPassword, newPassword});
      this.setToken(data.token);
    },
    async logout() {
      this.setToken(null);
      this.user = null;
    },
  },
});
