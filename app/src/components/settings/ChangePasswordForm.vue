<script setup lang="ts">
import {useUserStore} from '@/stores/userStore';
import {reactive, ref} from 'vue';
import ButtonInput from '../inputs/ButtonInput.vue';
import FormWrapper from '../inputs/FormWrapper.vue';
import TextInput from '../inputs/TextInput.vue';

const userStore = useUserStore();

const model = reactive({
  currentPassword: '',
  newPassword: '',
  newPassword2: '',
});

// we nee to force the form to re-render for the browser to show the update password dialog.
// We use a counter as key that increments on every successful api call to force it
const changed = ref(0);
const errorMessage = ref<null | string>(null);
const successMessage = ref<null | string>(null);
const saving = ref(false);

async function changePassword() {
  try {
    saving.value = true;
    errorMessage.value = null;

    if (model.newPassword != model.newPassword2) {
      throw new Error('New passwords need to match');
    }

    await userStore.changePassword(model.currentPassword, model.newPassword);

    changed.value++;
    successMessage.value = 'password changed';
    model.currentPassword = model.newPassword = model.newPassword2 = '';
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : `${error}`;
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <div :key="changed" class="w-full rounded-lg p-6 bg-slate-800 highlight-white/5">
    <FormWrapper :saving="saving" @submit="changePassword">
      <h3 class="text-center text-2xl text-slate-100 mb-3">
        Change password
      </h3>
      <input type="test" class="hidden" name="username" :value="userStore.user?.name">
      <TextInput v-model="model.currentPassword" label="Current password" icon="fa-lock"
        type="password" autocomplete="current-password" required />

      <TextInput v-model="model.newPassword" label="New password" icon="fa-lock"
        type="password" autocomplete="new-password" required />

      <TextInput v-model="model.newPassword2" label="Confirm new password" icon="fa-lock"
        type="password" autocomplete="new-password" required />

      <span v-if="errorMessage" class="text-red-500">{{errorMessage}}</span>
      <span v-if="successMessage" class="text-green-500">{{successMessage}}</span>

      <ButtonInput class="w-full mt-2" type="submit">Change password</ButtonInput>
    </FormWrapper>
  </div>
</template>
