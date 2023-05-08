<script setup>
import { ref, onMounted } from 'vue'
import { getAggregatesTableData } from '@/api'
import CreateWithWizzardModal from './CreateWithWizzardModal.vue'
import CreateNifiModal from './CreateNifiModal.vue'
import CreateAggregationModal from './CreateAggregation.vue'

const createWithWizzardModal = ref(null)
const createNifiModal = ref(null)
const createAggregationModal = ref(null)
const tableData = ref([])
const isLoading = ref(false)

const fetchTableData = async () => {
    try {
        isLoading.value = true
        tableData.value = await getAggregatesTableData()
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    fetchTableData()
})

const onCreateWithWizzardButtonClick = () => {
    createWithWizzardModal.value.run()
}
const onCreateFromNifiButtonClick = () => {
    createNifiModal.value.run()
}
const onCreateAggregationClick = () => {
    createAggregationModal.value.run()
}

const onUpdateButtonClick = () => {
    fetchTableData()
}

const onCalculate = (item) => {
    console.log('Run calculation', item)
}

const onEdit = (item) => {
    console.log('Edit', item)
}

const onDelete = (item) => {
    console.log('Delete', item)
}

const columns = [
    { key: "name", sortable: true },
    { key: "tableName", sortable: true },
    { key: "lastSchemaUpdate", sortable: true },
    { key: "lastDataUpdate", sortable: true },
    { key: "rowsCount", sortable: true },
    { key: "nextDataUpdate", sortable: true },
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
                    <va-button @click="onCreateWithWizzardButtonClick" preset="secondary" size="small">
                        Create with Wizzard
                    </va-button>
                    <va-button @click="onCreateFromNifiButtonClick" preset="secondary" size="small">
                        Create from NIFI Process
                    </va-button>
                    <va-button @click="onCreateAggregationClick" preset="secondary" size="small">
                        Create Aggregation
                    </va-button>
                </div>
            </va-button-dropdown>
        </div>
    </section>
    <va-data-table :loading="isLoading" class="app-table" :items="tableData" :columns="columns">
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

    <create-with-wizzard-modal ref="createWithWizzardModal" />
    <create-nifi-modal ref="createNifiModal" />
    <create-aggregation-modal ref="createAggregationModal" />
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