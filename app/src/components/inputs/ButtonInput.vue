<script setup lang="ts">
import {inject, type PropType} from 'vue';

const savingForm = inject<boolean>('savingForm');

const props = defineProps({
  type: {
    type: String as PropType<'submit' | 'reset' | 'button'>,
    default: 'button',
  },
  icon: String,
  disabled: Boolean,
  loading: Boolean,
});

const emit = defineEmits<{
  (event: 'click', e: MouseEvent): void
}>();
</script>

<template>
  <button :type="props.type" @click="e => emit('click', e)" :disabled="props.disabled || savingForm || loading"
    class="inline-flex items-center justify-center text-center bg-primary-500 highlight-white/10 transition-colors duration-150
      text-white rounded-md px-3 py-2 disabled:opacity-75 disabled:cursor-not-allowed hover:bg-primary-400">
    <slot></slot>
  </button>
</template>
