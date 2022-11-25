<script setup lang="ts">
import {useUsersApi} from '@/api';
import FormButton from '@/components/inputs/FormButton.vue';
import FormWrapper from '@/components/inputs/FormWrapper.vue';
import PermissionsPicker from '@/components/inputs/PermissionsPicker.vue';
import TextInput from '@/components/inputs/TextInput.vue';
import type {CreateUserModel} from 'api-client';
import {Permissions} from 'shared-types';
import {reactive, ref} from 'vue';
import {useRouter} from 'vue-router';

const usersApi = useUsersApi();
const router = useRouter();

const model = reactive<CreateUserModel>({
  username: '',
  password: '',
  permissions: Permissions.Active,
});

const errorMessage = ref<null | string>(null);
const saving = ref(false);

async function addUser() {
  try {
    saving.value = true;
    await usersApi.createUser(model);
    router.push({name: 'manageUsers'});
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : `${error}`;
  } finally {
    saving.value = false;
  }
}

</script>

<template>
  <div class="w-full flex justify-center">
    <div class="flex-1 max-w-sm flex flex-col gap-8">
      <div class="w-full rounded-lg p-6 bg-slate-800 highlight-white/5">
        <FormWrapper :saving="saving" @submit="addUser" autocomplete="off">
          <h3 class="text-center text-2xl text-slate-100 mb-3">
            Add new user
          </h3>
          <TextInput v-model="model.username" label="Name" icon="fa-user" minlength="3"
            type="text" autocomplete="off" placeholder="Username for the new user" required />

          <TextInput v-model="model.password" label="Password" icon="fa-lock" minlength="6"
            type="password" autocomplete="new-password" placeholder="Initial password for the new user" required />

          <PermissionsPicker v-model="model.permissions" label="Permissions" placeholder="Initial permissions" icon="fa-shield"/>

          <span v-if="errorMessage" class="text-red-500">{{errorMessage}}</span>

          <FormButton class="w-full mt-2" type="submit">Add new user</FormButton>
        </FormWrapper>
      </div>
    </div>
  </div>
</template>
