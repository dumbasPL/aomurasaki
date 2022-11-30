<script setup lang="ts">
import UserDropdown from './UserDropdown.vue';
import config from '@/config/index.json';

</script>

<template>
  <header class="sticky top-0 z-40 bg-primary-900 text-white px-4 p-2.5 flex justify-between items-center">
    <h1 class="text-xl block">
      <RouterLink :to="{name: 'home'}">{{config.name}}</RouterLink>
    </h1>
    <UserDropdown />
  </header>
</template>
