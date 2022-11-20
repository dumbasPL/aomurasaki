import {useUserStore} from '@/stores/userStore';
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import UserSettingsView from '@/views/UserSettingsView.vue';
import {createRouter, createWebHistory, START_LOCATION} from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/user/settings',
      name: 'currentUserSettings',
      component: UserSettingsView,
    },
  ],
});

router.beforeEach(async (to, from) => {
  const userStore = useUserStore();

  // fetch user data on initial page load
  if (from === START_LOCATION && userStore.hasToken) {
    await userStore.fetchUserInfo();
  }

  if (to.name == 'login') {
    // redirect to home if already logged in
    if (userStore.isLoggedIn) {
      return {name: 'home'};
    }
  } else if (!userStore.isLoggedIn) {
    // redirect to login page if not logged in already
    return {name: 'login'};
  }

  return true;
});

export default router;
