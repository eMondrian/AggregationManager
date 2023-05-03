import {
    createVuesticEssential, VaButton, VaButtonDropdown, VaInput, VaSelect, VaIcon, VaDataTable, VaNavbar, VaNavbarItem, VaModal, VaTabs, VaTab,
} from 'vuestic-ui'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

import './assets/main.css'
import 'vuestic-ui/css'

const app = createApp(App)

app.use(router)

app.use(createVuesticEssential({ components: { VaButton, VaButtonDropdown, VaInput, VaSelect, VaIcon, VaDataTable, VaNavbar, VaNavbarItem, VaModal, VaTabs, VaTab } }));
// app.config.globalProperties.$customWizzards = [{ 
//     openButtonText: '',
//     component: {},
//     onClose: ()=>{},
// }]
app.mount('#app')
