<script setup>
import sortBy from 'lodash/sortBy'
import { ref, onMounted, getCurrentInstance } from 'vue'
import { getAggregatesTableData, addAgregation, removeAgregation, getAggregation, updateAggregation } from '@/mocks/api'
// import { getAggregatesTableData, addAgregation, removeAgregation, getAggregation, updateAggregation } from '@/api'
import ConfirmationModal from '@/modals/ConfirmationModal.vue'
import LoadingIndicator from '@/modals/LoadingIndicator.vue'
import { useErrorHandler } from '@/composables'
import { sortNumbers } from '@/helpers'
import CreateAggregationModal from './CreateAggregationModal.vue'
import CreateNifiModal from './CreateNifiModal.vue'
import RunStatusModal from './RunStatusModal.vue'

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
            default_template: data.default_template,
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
                start_nifi_process_id: aggregationDesc.propertiesData.nifiProcessId,
                is_generated_nifi_process: !aggregationDesc.propertiesData.nifiProcessId,
                scheduling_period: aggregationDesc.scheduleData.schedule,
                scheduling_strategy: aggregationDesc.scheduleData.strategy,
            });
            createAggregationModal.value.resetState()
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
            createNifiModal.value.resetState()
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

const onCalculate = (item) => {
    runStatusModal.value.run(item.id);
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
            createAggregationModal.value.resetState()
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
    const { confirmed } = await confirmationModal.value.run({ message: 'Are you sure you want to remove this aggregation?' })
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

const columns = [
    { key: 'name', sortable: true },
    { key: 'tableName', sortable: true },
    { key: 'lastSchemaUpdate', sortable: true, sortingFn: sortNumbers },
    { key: 'schedule', sortable: true },
    { key: 'lastDataUpdate', sortable: true, sortingFn: sortNumbers },
    { key: 'lastEvent', sortable: true },
    { key: 'currentStatus', sortable: true },
    { key: 'actions', width: 80 },
];
</script>

<template>
    <section class="control-panel">
        <h2>List of aggregates</h2>
        <div class="buttons-container">
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
            <va-button-dropdown title="Create" preset="plain" hide-icon prevent-overflow>
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
                    <va-button v-for="wizzard in customWizzards" @click="onCustomWizzardsOpen[wizzard.name]" preset="secondary" size="small">
                        {{wizzard.name}}
                    </va-button>
                </div>
            </va-button-dropdown>
        </div>
    </section>
    <va-input
        v-model="filterValue"
        label="filter"
        placeholder="contains..."
        class="filter-input"
        clearable
    />
    <va-data-table
        :loading="isLoading"
        class="app-table"
        :items="tableData"
        :columns="columns"
        :filter="filterValue"
        sticky-header
        :scroll-bottom-margin="40"
    >
        <template #cell(lastSchemaUpdate)="data">
            <div>{{ data.rowData.lastSchemaUpdate.toLocaleString() }}</div>
        </template>
        <template #cell(lastDataUpdate)="data">
            <div>{{ data.rowData.lastDataUpdate.toLocaleString() }}</div>
        </template>
        <template #cell(actions)="{ rowIndex }">
            <div class="table-action-buttons">
                <va-button preset="plain" color="info" title="Run calculations" @click="onCalculate(tableData[rowIndex])">
                    <template #append>
                        <va-icon class="material-icons-outlined">
                            playlist_play
                        </va-icon>
                    </template>
                </va-button>
                <va-button preset="plain" color="info" title="Edit" @click="onEdit(tableData[rowIndex])">
                    <template #append>
                        <va-icon class="material-icons-outlined">
                            edit
                        </va-icon>
                    </template>
                </va-button>
                <va-button preset="plain" color="info" title="Delete" @click="onDelete(tableData[rowIndex])">
                    <template #append>
                        <va-icon class="material-icons-outlined">
                            delete
                        </va-icon>
                    </template>
                </va-button>
            </div>
        </template>
    </va-data-table>

    <teleport to="body">
        <create-aggregation-modal ref="createAggregationModal" />
        <create-nifi-modal ref="createNifiModal" />
        <component v-for="wizzard in customWizzards" :is="wizzard.component" :ref="customWizzardsRefs[wizzard.name]" :onSave="onCreateAggregationFromWizzard"></component>

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

.app-table {
    width: 100%;
    height: 100%;
}

.buttons-container {
    display: flex;
    gap: 0.5rem;
}

.table-action-buttons {
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