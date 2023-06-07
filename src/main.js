import {
    createVuesticEssential, VaButton, VaButtonDropdown, VaInput, VaSelect, VaIcon, VaDataTable, VaNavbar, VaNavbarItem, VaModal, VaTabs, VaTab, VaStepper, VaPopover, VaInnerLoading, VaAlert
} from 'vuestic-ui'
import { createApp } from 'vue'

import { addAgregation } from '@/api'
import CustomWizzard from '@/pages/AggregateList/components/CustomWizzard.vue'
import App from './App.vue'
import router from './router'

import 'vuestic-ui/css'
import './assets/main.css'


const app = createApp(App)

app.use(router)

app.use(createVuesticEssential({ components: { VaButton, VaButtonDropdown, VaInput, VaSelect, VaIcon, VaDataTable, VaNavbar, VaNavbarItem, VaModal, VaTabs, VaTab, VaStepper, VaPopover, VaInnerLoading, VaAlert } }));
app.config.globalProperties.$customWizzards = [
    { 
        name: 'Custom Wizzard #1#',
        component: CustomWizzard,
        open: (wizzardRef) => {
            wizzardRef.run()
        },
        onSave: async (data) => {
            try {
                await addAgregation({
                    name: data.tableData.name,
                    tableName: data.tableData.tableName.text,
                });
            } catch (e) {
                console.log(e)
            }
        }
    }
]
app.mount('#app')
