import {
    createVuesticEssential, VaButton, VaButtonDropdown, VaInput, VaSelect, VaIcon, VaDataTable, VaNavbar, VaNavbarItem, VaModal, VaTabs, VaTab, VaStepper, VaPopover, VaInnerLoading, VaAlert, VaDropdown, VaCheckbox
} from 'vuestic-ui'
import { AgGridVue } from 'ag-grid-vue3'
import { createApp } from 'vue'
import { KeycloakService } from './authorization/KeycloakService'
import CreateAggregationWithWizzardModal from '@/pages/AggregateList/components/CreateAggregationWithWizzardModal.vue'
import App from './App.vue'
import router from './router'

import 'ag-grid-community/styles/ag-grid.css';
import '@vuestic/ag-grid-theme'

import 'vuestic-ui/css'
import './assets/main.css'
import getConfig from './app.config'


const app = createApp(App)
const config = await getConfig();

app.use(router)

app.use(createVuesticEssential({ components: { VaButton, VaButtonDropdown, VaInput, VaSelect, VaIcon, VaDataTable, VaNavbar, VaNavbarItem, VaModal, VaTabs, VaTab, VaStepper, VaPopover, VaInnerLoading, VaAlert, VaDropdown, VaCheckbox } }));
app.config.globalProperties.$authConfig = config.auth;
app.config.globalProperties.$customWizzards = [
    { 
        name: 'Create with Wizzard',
        component: CreateAggregationWithWizzardModal,
        open: (wizzardRef) => {
            wizzardRef.run()
        },
    }
]
app.component('AgGridVue', AgGridVue)

const renderApp = () => {
    app.mount('#app')
};

if (config.auth.isKeycloakAuthActive) {
    KeycloakService.CallLogin(renderApp);
} else {
    renderApp()
}
