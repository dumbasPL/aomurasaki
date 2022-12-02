<script setup lang="ts">
import {computed, ref, watch} from 'vue';
import {RouterView, useRoute} from 'vue-router';
import {useMq} from 'vue3-mq';
import PageHeader from './components/header/PageHeader.vue';
import PageSidebar from './components/sidebar/PageSidebar.vue';
import ErrorCatcher from './components/util/ErrorCatcher.vue';
import {useUserStore} from './stores/userStore';

const mq = useMq();
const userStore = useUserStore();
const route = useRoute();

function wasDesktopSidebarExpanded() {
  // will default to expanded if the value is null
  return window.localStorage.getItem('desktopSidebar') !== 'hidden';
}

const sidebarExpanded = ref(false);

const isMobile = computed(() => mq.mdMinus);
watch(() => isMobile.value, val => {
  sidebarExpanded.value = val ? false : wasDesktopSidebarExpanded();
}, {immediate: true});

watch(() => sidebarExpanded.value, val => {
  if (!isMobile.value) {
    window.localStorage.setItem('desktopSidebar', val ? 'expanded' : 'hidden');
  }
});

</script>

<template>
  <div class="flex flex-col h-full">
    <PageHeader v-if="userStore.isLoggedIn" :key="route.fullPath" v-model="sidebarExpanded" />
    <div class="flex flex-1 h-0">
      <PageSidebar v-if="userStore.isLoggedIn" v-model:expanded="sidebarExpanded" :is-mobile="isMobile" />
      <RouterView v-slot="{Component}">
        <Suspense timeout="200">
          <main class="flex-grow p-6 overflow-auto">
            <ErrorCatcher>
              <component :is="Component"/>
            </ErrorCatcher>
          </main>
          <template #fallback>
            <div class="grid w-full h-full place-content-center">
              <span class="animate-ping h-6 w-6 rounded-full bg-primary-400/75"></span>
            </div>
          </template>
        </Suspense>
      </RouterView>
    </div>
  </div>
</template>
