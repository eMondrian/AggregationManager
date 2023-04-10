import { createVuesticEssential, VaButton } from 'vuestic-ui'
import 'vuestic-ui/css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)


app.use(createVuesticEssential({ components: { VaButton } }));
app.mount('#app')
