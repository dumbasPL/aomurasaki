<script setup lang="ts">
import {RouterView, useRoute} from 'vue-router';
import PageHeader from './components/header/PageHeader.vue';
import PageSidebar from './components/sidebar/PageSidebar.vue';
import ErrorCatcher from './components/util/ErrorCatcher.vue';
import {useUserStore} from './stores/userStore';

const userStore = useUserStore();
const route = useRoute();
</script>

<template>
  <div class="flex flex-col h-full">
    <PageHeader v-if="userStore.isLoggedIn" :key="route.fullPath" />
    <div class="flex flex-1">
      <PageSidebar v-if="userStore.isLoggedIn" />
      <RouterView v-slot="{Component}">
        <Suspense timeout="200">
          <main class="flex-grow p-6">
            <ErrorCatcher>
              <component :is="Component"/>
            </ErrorCatcher>
          </main>
          <template #fallback>
            <div class="grid w-full h-full place-content-center">
              <span class="animate-ping h-6 w-6 rounded-full bg-primary-400/75"></span>
            </div>
          </template>
        </Suspense>
      </RouterView>
    </div>
  </div>
</template>
