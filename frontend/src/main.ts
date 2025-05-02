import './assets/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { vuetify } from './plugins/vuetify'
import { AuthService } from '@/services/auth/auth.service';

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)
AuthService.initAuthToken();

app.mount('#app')
