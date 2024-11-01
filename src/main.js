import {
    createVuesticEssential, VaButton, VaButtonDropdown, VaInput, VaSelect, VaIcon, VaDataTable, VaNavbar, VaNavbarItem, VaModal, VaTabs, VaTab, VaStepper, VaPopover, VaInnerLoading, VaAlert, VaDropdown
} from 'vuestic-ui'
import { AgGridVue } from 'ag-grid-vue3'
import { createApp } from 'vue'

import CreateAggregationWithWizzardModal from '@/pages/AggregateList/components/CreateAggregationWithWizzardModal.vue'
import App from './App.vue'
import router from './router'

import 'ag-grid-community/styles/ag-grid.css';
import '@vuestic/ag-grid-theme'

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

app.component('AgGridVue', AgGridVue)

app.mount('#app')
