import {createApp} from 'vue';
import {createPinia} from 'pinia';
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
import FloatingVue, {VTooltip} from 'floating-vue';
import {Vue3Mq, type Config as MqConfig} from 'vue3-mq';
import App from './App.vue';
import router from './router';
import './icons';
import breakpoints from '@/config/breakpoints.json';

import './assets/style.scss';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(Vue3Mq, {breakpoints} satisfies MqConfig);

FloatingVue.options.container = '#popovers';
FloatingVue.options.themes.tooltip.delay.show = 0;

app.component('font-awesome-icon', FontAwesomeIcon);
app.directive('tooltip', VTooltip);

app.mount('#app');
