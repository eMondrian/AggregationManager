import {
    createVuesticEssential, VaButton, VaButtonDropdown, VaInput, VaSelect, VaIcon, VaDataTable, VaNavbar, VaNavbarItem, VaModal, VaTabs, VaTab, VaStepper, VaPopover, VaInnerLoading, VaAlert, VaDropdown
} from 'vuestic-ui'
import { createApp } from 'vue'
import { KeycloakService } from './authorization/KeycloakService'
import CreateAggregationWithWizzardModal from '@/pages/AggregateList/components/CreateAggregationWithWizzardModal.vue'
import App from './App.vue'
import router from './router'

import 'vuestic-ui/css'
import './assets/main.css'


const app = createApp(App)

app.use(router)

app.use(createVuesticEssential({ components: { VaButton, VaButtonDropdown, VaInput, VaSelect, VaIcon, VaDataTable, VaNavbar, VaNavbarItem, VaModal, VaTabs, VaTab, VaStepper, VaPopover, VaInnerLoading, VaAlert, VaDropdown } }));
app.config.globalProperties.$customWizzards = [
    { 
        name: 'Create with Wizzard',
        component: CreateAggregationWithWizzardModal,
        open: (wizzardRef) => {
            wizzardRef.run()
        },
    }
]

const renderApp = () => {
    app.mount('#app')
};
  
KeycloakService.CallLogin(renderApp);

