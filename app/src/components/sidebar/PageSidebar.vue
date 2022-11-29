<script setup lang="ts">
import {useUserStore} from '@/stores/userStore';
import SidebarButton from './SidebarButton.vue';

const userStore = useUserStore();

</script>

<template>
  <div class="bg-slate-800">
    <nav class="w-64 flex flex-col gap-1 px-2 pt-2">
      <SidebarButton icon="fa-solid fa-house" :href="{name: 'home'}">Home</SidebarButton>
      <template v-if="userStore.permissions.Admin">
        <SidebarButton icon="fa-solid fa-users" :href="{name: 'manageUsers'}">Users</SidebarButton>
      </template>
    </nav>
  </div>
</template>
