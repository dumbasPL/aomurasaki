<script setup lang="ts">
import { computed, provide } from 'vue';

const props = defineProps({
  saving: Boolean,
});

const emit = defineEmits<{
  (event: 'submit', e: Event): void,
}>();

provide('savingForm', computed(() => props.saving));
</script>

<template>
  <form @submit.prevent="e => emit('submit', e)">
    <slot></slot>
  </form>
</template>