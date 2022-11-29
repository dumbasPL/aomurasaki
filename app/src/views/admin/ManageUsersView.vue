<script setup lang="ts">
import AddButton from '@/components/inputs/AddButton.vue';

</script>

<template>
  <div class="w-full flex justify-between items-end mb-3">
    <h1 class="block text-xl text-slate-200 font-bold">Manage Users</h1>
    <div>
      <AddButton :href="{name: 'manageUsersAddNew'}">Add new user</AddButton>
    </div>
  </div>
</template>
