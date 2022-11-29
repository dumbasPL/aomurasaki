<script setup lang="ts">
defineProps<{
  icon: string,
}>();

const emit = defineEmits<{
  (event: 'click', e: MouseEvent): void
}>();
</script>

<template>
  <button @click="e => emit('click', e)"
    class="text-xl text-slate-400 hover:text-slate-200 transition-colors duration-150">
    <font-awesome-icon :icon="icon" />
  </button>
</template>
