<script setup lang="ts">
import {RouterView, useRoute} from 'vue-router';
import PageHeader from './components/header/PageHeader.vue';
import PageSidebar from './components/sidebar/PageSidebar.vue';
import {useUserStore} from './stores/userStore';

const userStore = useUserStore();
const route = useRoute();
</script>

<template>
  <div class="flex flex-col h-full">
    <PageHeader v-if="userStore.isLoggedIn" :key="route.fullPath" />
    <div class="flex flex-1">
      <PageSidebar v-if="userStore.isLoggedIn" />
      <RouterView class="p-6" />
    </div>
  </div>
</template>
