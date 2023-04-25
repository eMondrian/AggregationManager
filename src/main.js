import { createVuesticEssential, VaButton, VaInput, VaSelect, VaIcon, VaDataTable, VaNavbar, VaNavbarItem, VaModal } from 'vuestic-ui'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/main.css'
import 'vuestic-ui/css'

const app = createApp(App)

app.use(createPinia())
app.use(router)


app.use(createVuesticEssential({ components: { VaButton, VaInput, VaSelect, VaIcon, VaDataTable, VaNavbar, VaNavbarItem, VaModal } }));
app.mount('#app')
