<script setup lang="ts">
import {useUserStore} from '@/stores/userStore';
import SidebarButton from './SidebarButton.vue';

const props = defineProps<{
  expanded: boolean,
  isMobile?: boolean,
}>();

const emit = defineEmits<{
  (event: 'update:expanded', value: boolean): void,
}>();

const userStore = useUserStore();

function hideOnMobile() {
  if (props.isMobile) {
    emit('update:expanded', false);
  }
}

</script>

<template>
  <Transition name="custom-classes" enter-from-class="opacity-0" leave-to-class="opacity-0">
    <div v-if="(expanded && isMobile)" @click="hideOnMobile"
      class="bg-slate-800/50 w-full h-full absolute inset-0 block transition-opacity ease-in-out duration-300"></div>
  </Transition>
  <div :class="{'w-0': isMobile}" class="relative">
    <Transition name="custom-classes" enter-from-class="-translate-x-full" leave-to-class="-translate-x-full">
      <div v-if="expanded"
        class="bg-slate-800 h-full w-64 absolute lg:static top-0 left-0 bottom-0 transition-transform ease-in-out duration-300" >
        <nav class="flex flex-col gap-1 px-2 pt-2">
          <SidebarButton icon="fa-solid fa-house" :href="{name: 'home'}" @click="hideOnMobile">Home</SidebarButton>
          <template v-if="userStore.permissions.Admin">
            <SidebarButton icon="fa-solid fa-users" :href="{name: 'manageUsers'}" @click="hideOnMobile">Users</SidebarButton>
          </template>
        </nav>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
</style>
