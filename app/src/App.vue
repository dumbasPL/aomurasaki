<script setup lang="ts">
import {RouterView, useRoute} from 'vue-router';
import PageHeader from './components/header/PageHeader.vue';
import {useUserStore} from './stores/userStore';

const userStore = useUserStore();
const route = useRoute();
</script>

<template>
  <PageHeader v-if="userStore.isLoggedIn" :key="route.fullPath" />
  <RouterView />
</template>
