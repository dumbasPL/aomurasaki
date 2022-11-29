<script setup lang="ts">
import {useUsersApi} from '@/api';
import EditUserForm from '@/components/settings/users/EditUserForm.vue';
import type {CreateUserModel} from 'api-client';
import {Permissions} from 'shared-types';
import {ref} from 'vue';
import {useRouter} from 'vue-router';

const usersApi = useUsersApi();
const router = useRouter();

const model = ref<CreateUserModel>({
  username: '',
  password: '',
  permissions: Permissions.Active,
});

const errorMessage = ref<string>();
const saving = ref(false);

async function addUser() {
  try {
    errorMessage.value = undefined;
    saving.value = true;
    await usersApi.createUser(model.value);
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
        <EditUserForm @submit="addUser" title="Add new user"
          v-model="model" :saving="saving" :error-message="errorMessage" />
      </div>
    </div>
  </div>
</template>
