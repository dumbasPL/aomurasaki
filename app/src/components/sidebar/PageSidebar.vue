<script setup lang="ts">
import SidebarButton from './SidebarButton.vue';

</script>

<template>
  <div class="bg-slate-800">
    <div class="w-64 flex flex-col gap-1 px-2 pt-2">
      <SidebarButton icon="fa-solid fa-house" :href="{name: 'home'}">Home</SidebarButton>
      <!-- <SidebarButton icon="fa-solid fa-gear" href="'x'">Settings</SidebarButton> -->
      <SidebarButton icon="fa-solid fa-users" :href="{name: 'manageUsers'}">Users</SidebarButton>
    </div>
  </div>
</template>
