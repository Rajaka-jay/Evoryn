import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // This looks for the "default" export from router/index.ts


const app = createApp(App)
app.use(router)
app.mount('#app')