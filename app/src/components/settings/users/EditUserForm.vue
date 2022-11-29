<script setup lang="ts">
import FormButton from '@/components/inputs/FormButton.vue';
import FormWrapper from '@/components/inputs/FormWrapper.vue';
import PermissionsPicker from '@/components/inputs/PermissionsPicker.vue';
import TextInput from '@/components/inputs/TextInput.vue';
import {computed} from 'vue';

interface Model {
  username: string;
  password: string;
  permissions: number;
}

const props = withDefaults(defineProps<{
  title: string,
  modelValue: Model,
  saving?: boolean
  errorMessage?: string,
}>(), {
  title: 'Edit user',
});

const emit = defineEmits<{
  (event: 'submit', e: Event): void,
  (event: 'update:modelValue', model: Model): void,
}>();

const inputUsername = computed({
  get: () => props.modelValue.username,
  set: value => emit('update:modelValue', {...props.modelValue, username: value}),
});

const inputPassword = computed({
  get: () => props.modelValue.password,
  set: value => emit('update:modelValue', {...props.modelValue, password: value}),
});

const inputPermissions = computed({
  get: () => props.modelValue.permissions,
  set: value => emit('update:modelValue', {...props.modelValue, permissions: value}),
});

</script>

<template>
  <FormWrapper :saving="saving" @submit="e => emit('submit', e)" autocomplete="off">
    <h3 class="text-center text-2xl text-slate-100 mb-3">{{title}}</h3>

    <TextInput v-model="inputUsername" label="Name" icon="fa-user" minlength="3"
      type="text" autocomplete="off" placeholder="Username for the new user" required />

    <TextInput v-model="inputPassword" label="Password" icon="fa-lock" minlength="6"
      type="password" autocomplete="new-password" placeholder="Initial password for the new user" required />

    <PermissionsPicker v-model="inputPermissions" label="Permissions" placeholder="Initial permissions" icon="fa-shield"/>

    <span v-if="errorMessage" class="text-red-500">{{errorMessage}}</span>

    <FormButton class="w-full mt-2" type="submit">{{title}}</FormButton>
  </FormWrapper>
</template>
