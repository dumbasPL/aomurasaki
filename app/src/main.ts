import {createApp} from 'vue';
import {createPinia} from 'pinia';
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
import FloatingVue, {VTooltip} from 'floating-vue';
import App from './App.vue';
import router from './router';
import './icons';

import './assets/style.scss';

const app = createApp(App);

app.use(createPinia());
app.use(router);

FloatingVue.options.container = '#popovers';
FloatingVue.options.themes.tooltip.delay.show = 0;

app.component('font-awesome-icon', FontAwesomeIcon);
app.directive('tooltip', VTooltip);

app.mount('#app');
