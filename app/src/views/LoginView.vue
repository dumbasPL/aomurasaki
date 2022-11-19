<script setup lang="ts">
import { useUserApi } from '@/api';
import ButtonInput from '@/components/inputs/ButtonInput.vue';
import FormWrapper from '@/components/inputs/FormWrapper.vue';
import TextInput from '@/components/inputs/TextInput.vue';
import type { LoginModel } from 'api-client';
import { reactive, ref } from 'vue';
import UnauthorizedError from '../api/errors/UnauthorizedError';

const saving = ref(false);
const userApi = useUserApi();

const inputs = reactive<LoginModel>({
  username: '',
  password: '',
});

const errorMessage = ref<string | null>(null);

async function login() {
  try {
    errorMessage.value = null;
    const {data} = await userApi.login(inputs);
    window.localStorage.setItem('token', data.token);
    console.log(data.user);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      errorMessage.value = error.reason;
    } else {
      errorMessage.value = `${error}`;
    }
  }
}

</script>

<template>
  <div class="w-screen h-screen grid place-content-center">
    <div>
      <div class="text-center mb-6">
        <h1 class="text-2xl text-slate-200">Welcome to {{'Aomurasaki'}}</h1>
        <h3 class="text-lg text-slate-500">Please log in to continue</h3>
      </div>
      <div class="rounded-lg p-6 bg-slate-800 highlight-white/5 w-96">
        <FormWrapper @submit="login" :saving="saving">
          <TextInput v-model="inputs.username" label="username" placeholder="Enter your username" 
            type="text" icon="fa-user" autocomplete="username" autofocus />
  
          <TextInput v-model="inputs.password" label="password" placeholder="Enter your password" 
            type="password" icon="fa-lock" autocomplete="current-password" />

          <span v-if="errorMessage" class="text-red-500">{{errorMessage}}</span>
  
          <ButtonInput class="w-full mt-2" type="submit">Login</ButtonInput>
        </FormWrapper>
      </div>
    </div>
  </div>
</template>