<script setup lang="ts">
import {useUserStore} from '@/stores/userStore';

const userStore = useUserStore();
</script>

<template>
  <main class="font-bold">
    Welcome: {{userStore.user?.name}}
  </main>
</template>
