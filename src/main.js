import {
    createVuesticEssential, VaButton, VaButtonDropdown, VaInput, VaSelect, VaIcon, VaDataTable, VaNavbar, VaNavbarItem, VaModal, VaTabs, VaTab, VaStepper, VaPopover, VaInnerLoading, VaAlert, VaDropdown, VaCheckbox
} from 'vuestic-ui'
import { createApp } from 'vue'
import { KeycloakService } from './authorization/KeycloakService'
import CreateAggregationWithWizzardModal from '@/pages/AggregateList/components/CreateAggregationWithWizzardModal.vue'
import config from './app.config'
import App from './App.vue'
import router from './router'

import 'vuestic-ui/css'
import './assets/main.css'


const app = createApp(App)

app.use(router)

app.use(createVuesticEssential({ components: { VaButton, VaButtonDropdown, VaInput, VaSelect, VaIcon, VaDataTable, VaNavbar, VaNavbarItem, VaModal, VaTabs, VaTab, VaStepper, VaPopover, VaInnerLoading, VaAlert, VaDropdown, VaCheckbox } }));
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

if (config.auth.isKeycloakAuthActive) {
    KeycloakService.CallLogin(renderApp);
} else {
    renderApp()
}


