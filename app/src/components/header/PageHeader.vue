<script setup lang="ts">
import UserDropdown from './UserDropdown.vue';
import config from '@/config/index.json';
import IconButton from '../inputs/IconButton.vue';
import {computed} from 'vue';

const props = withDefaults(defineProps<{
  modelValue: boolean | null,
}>(), {
  modelValue: null,
});

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
}>();

const sidebarExists = computed(() => typeof props.modelValue == 'boolean');

function toggleSidebar() {
  emit('update:modelValue', !props.modelValue);
}

</script>

<template>
  <header class="sticky top-0 z-40 bg-primary-900 text-white px-4 p-2.5 flex justify-between items-center">
    <div>
      <IconButton v-if="sidebarExists" @click="toggleSidebar" icon="fa-solid fa-bars" class="inline-block mr-4"/>
      <h1 class="text-xl inline-block">
        <RouterLink :to="{name: 'home'}">{{config.name}}</RouterLink>
      </h1>
    </div>
    <UserDropdown />
  </header>
</template>
