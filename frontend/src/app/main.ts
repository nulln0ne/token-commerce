import { createApp } from 'vue';
import App from '@/app/App.vue';
import router from '@/app/router';
import { createPinia } from 'pinia';

const pinia = createPinia();

createApp(App)
    .use(pinia)
    .use(router)
    .mount('#app')
