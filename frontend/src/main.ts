import './styles/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { vuetify } from './plugins/vuetify'
import { AuthService } from '@/services/auth/auth.service';
import AppSnackbar from './components/snackbar/AppSnackbar.vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.component('AppSnackbar', AppSnackbar)
AuthService.initAuthToken();

app.mount('#app')
