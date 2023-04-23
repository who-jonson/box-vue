import { createApp } from 'vue';
import { createHead } from '@unhead/vue';

import App from './App.vue';

createApp(App)
  .use(createHead())
  .mount('#app');
