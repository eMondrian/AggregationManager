<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'
import { getAggregatesTableData, addAgregation, removeAgregation, getAggregation, updateAggregation } from '@/api'
import CreateAggregationModal from './CreateAggregationModal.vue'
import CreateNifiModal from './CreateNifiModal.vue'
import ConfirmationModal from '@/modals/ConfirmationModal.vue'
import LoadingIndicator from '@/modals/LoadingIndicator.vue'
import { useErrorHandler } from '@/composables'

const app = getCurrentInstance()
const customWizzards = app.appContext.config.globalProperties.$customWizzards

const createAggregationModal = ref(null)
const createNifiModal = ref(null)
const confirmationModal = ref(null)
const tableData = ref([])
const isLoading = ref(false)
const apiCallRunning = ref(false);

const { handleError } = useErrorHandler();

const fetchTableData = async () => {
    try {
        isLoading.value = true
        tableData.value = await getAggregatesTableData()
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

const wrappedOnSaveWizzard = (onSave) => async (data) => {
    await onSave(data)
    await fetchTableData()
}

onMounted(() => {
    fetchTableData()
})

const onCreateAggregationClick = async () => {
    const aggregationDesc = await createAggregationModal.value.run()
    
    if (aggregationDesc) {
        try {
            apiCallRunning.value = true;

            await addAgregation({
                aggregation_name: aggregationDesc.propertiesData.name,
                table_name: aggregationDesc.propertiesData.tableName,
                query: aggregationDesc.query,
                start_nifi_process_id: aggregationDesc.propertiesData.nifiProcessName,
                is_generated_nifi_process: !aggregationDesc.propertiesData.nifiProcessName,
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
    console.log('Run calculation', item)
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
                start_nifi_process_id: aggregationDesc.propertiesData.nifiProcessName,
                is_generated_nifi_process: !!aggregationDesc.propertiesData.nifiProcessName,
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

const onDelete = async (item) => {
    const { confirmed } = await confirmationModal.value.run({ message: "Are you sure you want do remove this aggregation?" })
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
    { key: "name", sortable: true },
    { key: "tableName", sortable: true },
    { key: "lastSchemaUpdate", sortable: true },
    { key: "schedule", sortable: true },
    { key: "lastDataUpdate", sortable: true },
    { key: "lastEvent", sortable: true },
    { key: "actions", width: 80 },
];
</script>

<template>
    <section class="control-panel">
        <h2>List of aggregates</h2>
        <div class="buttons-container">
            <va-button @click="onUpdateButtonClick" preset="plain">
                <template #append>
                    <va-icon size="large" class="material-icons-outlined">
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
                    <va-button v-for="wizzard in this.$customWizzards" @click="onCustomWizzardsOpen[wizzard.name]" preset="secondary" size="small">
                        {{wizzard.name}}
                    </va-button>
                </div>
            </va-button-dropdown>
        </div>
    </section>
    <va-data-table :loading="isLoading" class="app-table" :items="tableData" :columns="columns">
        <template #cell(lastSchemaUpdate)="data">
            <div>{{ data.rowData.lastSchemaUpdate }}</div>
        </template>
        <template #cell(actions)="{ rowIndex }">
            <div class="table-action-buttons">
                <va-button preset="plain" color="info" title="Run calculations" @click="onCalculate(tableData[rowIndex])">
                    <template #append>
                        <va-icon class="material-icons-outlined">
                            calculate
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

    <create-aggregation-modal ref="createAggregationModal" />
    <create-nifi-modal ref="createNifiModal" />
    <component v-for="wizzard in this.$customWizzards" :is="wizzard.component" :ref="customWizzardsRefs[wizzard.name]" :onSave="wrappedOnSaveWizzard(wizzard.onSave)"></component>

    <loading-indicator :isOpened="apiCallRunning" />
    <confirmation-modal ref="confirmationModal"  />
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

.app-table {
    display: flex;
    height: 100%;
    min-height: 10rem;
    width: 100%;
    overflow-x: hidden;
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