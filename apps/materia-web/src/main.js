import { createApp } from 'vue';
import { createPinia } from 'pinia';
import '@keep/ui/fonts';
import './style.css';
import App from './App.vue';
import { router } from './router';
import { useHouseStore } from './stores/house';

const app = createApp(App);
const pinia = createPinia();
app.use(pinia).use(router);
useHouseStore(pinia).load();
app.mount('#app');
