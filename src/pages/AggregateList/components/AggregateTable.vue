<script setup>
import sortBy from 'lodash/sortBy'
import { ref, onMounted, getCurrentInstance } from 'vue'
import { useToast } from 'vuestic-ui'
import { getAggregatesTableData, addAgregation, removeAgregation, getAggregation, updateAggregation, resetCommand } from '@/api'
import ConfirmationModal from '@/modals/ConfirmationModal.vue'
import LoadingIndicator from '@/modals/LoadingIndicator.vue'
import { useErrorHandler } from '@/composables'
import { sortNumbers } from '@/helpers'
import CreateAggregationModal from './CreateAggregationModal.vue'
import CreateNifiModal from './CreateNifiModal.vue'
import RunStatusModal from './RunStatusModal.vue'
import ActionCell from './ActionCell.vue'

const app = getCurrentInstance()
const customWizzards = app.appContext.config.globalProperties.$customWizzards

const createAggregationModal = ref(null)
const createNifiModal = ref(null)
const confirmationModal = ref(null)
const runStatusModal = ref(null)
const tableData = ref([])
const isLoading = ref(false)
const apiCallRunning = ref(false);
const filterValue = ref('')

const { handleError } = useErrorHandler();
const { init } = useToast()

const fetchTableData = async () => {
    try {
        isLoading.value = true
        const data = await getAggregatesTableData()
        tableData.value = sortBy(data, ({ name }) => name)
    } catch (e) {
        handleError(e);
    } finally {
        isLoading.value = false
    }
}

const customWizzardsRefs = customWizzards.reduce((acc, { name }) => {
    acc[name] = ref(null)
    return acc
}, {})

const onCustomWizzardsOpen = customWizzards.reduce((acc, { name, open }) => {
    acc[name] = () => open(customWizzardsRefs[name].value[0])
    return acc
}, {})

onMounted(() => {
    fetchTableData()
})

const onCreateAggregationFromWizzard = async (data) => {
    try {
        apiCallRunning.value = true;

        await addAgregation({
            aggregation_name: data.aggregation_name,
            table_name: data.table_name,
            query: data.query,
            is_generated_nifi_process: data.is_generated_nifi_process,
            scheduling_period: data.scheduling_period,
            scheduling_strategy: data.scheduling_strategy,
        });

        await fetchTableData()
    } catch (e) {
        throw e;
    } finally {
        apiCallRunning.value = false;
    }
}

const onCreateAggregationClick = async () => {
    const aggregationDesc = await createAggregationModal.value.run()
    
    if (aggregationDesc) {
        try {
            apiCallRunning.value = true;

            await addAgregation({
                aggregation_name: aggregationDesc.propertiesData.name,
                table_name: aggregationDesc.propertiesData.tableName,
                query: aggregationDesc.query,
                template: aggregationDesc.templateId,
                start_nifi_process_id: aggregationDesc.propertiesData.nifiProcessId,
                is_generated_nifi_process: !aggregationDesc.propertiesData.nifiProcessId,
                scheduling_period: aggregationDesc.scheduleData.schedule,
                scheduling_strategy: aggregationDesc.scheduleData.strategy,
            });

            await fetchTableData()
        } catch (e) {
            handleError(e);
            apiCallRunning.value = false;
            await onCreateAggregationClick()
        } finally {
            apiCallRunning.value = false;
        }
    }
}
const onCreateFromNifiButtonClick = async () => {
    const nifiAggregation = await createNifiModal.value.run()
    if (nifiAggregation) {
        try {
            apiCallRunning.value = true;
            await addAgregation({
                aggregation_name: nifiAggregation.name,
                is_generated_nifi_process: false,
                start_nifi_process_id: nifiAggregation.process,
            })

            await fetchTableData()
        } catch (e) {
            handleError(e);
            apiCallRunning.value = false;
            await onCreateFromNifiButtonClick()
        } finally {
            apiCallRunning.value = false;
        }
    }
}

const onUpdateButtonClick = () => {
    fetchTableData()
}

const onCalculate = async (item) => {
    await runStatusModal.value.run({id: item.id, name: item.name});
    await fetchTableData()
}

const onEdit = async (item) => {
    const aggregation = await getAggregation(item.id);
    const aggregationDesc = await createAggregationModal.value.run(aggregation);

    if (aggregationDesc) {
        try {
            apiCallRunning.value = true;
            await updateAggregation({
                aggregation_name: aggregationDesc.propertiesData.name,
                table_name: aggregationDesc.propertiesData.tableName,
                query: aggregationDesc.query,
                start_nifi_process_id: aggregationDesc.propertiesData.nifiProcessId,
                is_generated_nifi_process: !!aggregationDesc.propertiesData.nifiProcessId,
                scheduling_period: aggregationDesc.scheduleData.schedule,
                scheduling_strategy: aggregationDesc.scheduleData.strategy,
                id: item.id,
            });

            await fetchTableData()
        } catch (e) {
            handleError(e);
            apiCallRunning.value = false;
            await onCreateAggregationClick()
        } finally {
            apiCallRunning.value = false;
        }
    }
}

const onDelete = async (item) => {
    const { confirmed } = await confirmationModal.value.run({ 
        message: 'Are you sure you want to remove this aggregation?', 
        id: item.id, 
        name: item.name 
    })

    if (!confirmed) return;
    try {
        apiCallRunning.value = true;
        await removeAgregation(item.id);
        await fetchTableData();
    } catch (e) {
        handleError(e);
    } finally {
        apiCallRunning.value = false;
    }
};

const reset = async (item) => {
    try {
        await resetCommand(item.id)
        await fetchTableData()
        init({ message: 'Aggregation was successfully reseted', color: 'success', duration: 3500 })
    } catch (e) {
        handleError(e);
    }
}

const columns = [
    { field: 'name', sortable: true, pinned: 'left' },
    { field: 'tableName', sortable: true },
    { field: 'lastSchemaUpdate', sortable: true, comparator: sortNumbers, valueFormatter: data => data.value.toLocaleString() },
    { field: 'schedule', sortable: true, lockPinned: true },
    { field: 'lastDataUpdate', sortable: true, comparator: sortNumbers, valueFormatter: data => data.value.toLocaleString() },
    { field: 'lastEvent', sortable: true, lockPinned: true },
    { field: 'createdBy', sortable: true },
    { field: 'lastModifiedBy', sortable: true },
    { field: 'currentStatus', sortable: true },
    { 
        field: 'actions', 
        width: 130, 
        sortable: false, 
        cellRenderer: ActionCell,
        cellRendererParams: {
            onCalculate,
            onEdit,
            onDelete,
            reset
        },
    },
];

const gridOptions = {
    suppressMovableColumns: true
};

const rowSelection = {
    mode: 'singleRow',
    checkboxes: false,
    enableClickSelection: true,
}

const autoSizeStrategy = {
    type: 'fitGridWidth',
};

</script>

<template>
    <section class="control-panel">
        <h2>List of aggregates</h2>
        <div class="buttons-container">
            <va-button-dropdown title="Create" preset="plain" hide-icon prevent-overflow class="add-aggregation-dropdown">
                <template #label>
                    <va-icon size="large" class="material-icons-outlined">
                        add_box
                    </va-icon>
                </template>

                <div class="nested-create-buttons">
                    <va-button @click="onCreateAggregationClick" preset="secondary" size="small">
                        Create Aggregation
                    </va-button>
                    <va-button @click="onCreateFromNifiButtonClick" preset="secondary" size="small">
                        Create from NIFI Process
                    </va-button>
                    <va-button v-for="wizzard in customWizzards" :key="wizzard.name" @click="onCustomWizzardsOpen[wizzard.name]" preset="secondary" size="small">
                        {{wizzard.name}}
                    </va-button>
                </div>
            </va-button-dropdown>
            <va-button @click="onUpdateButtonClick" preset="plain" :disabled="isLoading">
                <template #append>
                    <va-icon size="large"
                        :class = "{
                            'material-icons-outlined': true,
                            'app-spinned-icon': isLoading
                        }"
                    >
                        change_circle
                    </va-icon>
                </template>
            </va-button>
        </div>
    </section>

    <va-input
        v-model="filterValue"
        label="filter"
        placeholder="contains..."
        class="filter-input"
        clearable
    />

    <ag-grid-vue
        :loading="isLoading"
        class="ag-theme-vuestic"
        style="height: 100%;"
        :rowData="tableData"
        :columnDefs="columns"
        :gridOptions="gridOptions"
        :rowSelection="rowSelection"
        :quickFilterText="filterValue"
        :autoSizeStrategy="autoSizeStrategy"
        >
    </ag-grid-vue>

    <teleport to="body">
        <create-aggregation-modal ref="createAggregationModal" />
        <create-nifi-modal ref="createNifiModal" />
        <component v-for="wizzard in customWizzards" :key="wizzard.name" :is="wizzard.component" :ref="customWizzardsRefs[wizzard.name]" :onSave="onCreateAggregationFromWizzard"></component>

        <loading-indicator :isOpened="apiCallRunning" />
        <confirmation-modal ref="confirmationModal"  />
        <run-status-modal ref="runStatusModal" />
    </teleport>
</template>

<style lang="scss" scoped>
// To remove additional magic 2px height
// original height is 32px, but got 34px without any additional styles
.va-button-dropdown {
    height: 2rem;
}

.control-panel {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.filter-input {
    width: 25rem;
    max-width: 40%;
}

.buttons-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.nested-create-buttons {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
}
</style>