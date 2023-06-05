import {
    createVuesticEssential, VaButton, VaButtonDropdown, VaInput, VaSelect, VaIcon, VaDataTable, VaNavbar, VaNavbarItem, VaModal, VaTabs, VaTab, VaStepper, VaPopover, VaInnerLoading, VaAlert
} from 'vuestic-ui'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

import 'vuestic-ui/css'
import './assets/main.css'


const app = createApp(App)

app.use(router)

app.use(createVuesticEssential({ components: { VaButton, VaButtonDropdown, VaInput, VaSelect, VaIcon, VaDataTable, VaNavbar, VaNavbarItem, VaModal, VaTabs, VaTab, VaStepper, VaPopover, VaInnerLoading, VaAlert } }));
// app.config.globalProperties.$customWizzards = [{ 
//     openButtonText: '',
//     component: {},
//     onClose: ()=>{},
// }]
app.mount('#app')
