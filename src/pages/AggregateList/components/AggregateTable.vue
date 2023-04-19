<script setup>
import { ref, onMounted } from 'vue'
import { generateTableData } from '@/helpers/generateMocks'
import { getAggregatesTableData } from '@/api'
import CreateNifiModal from './CreateNifiModal.vue'

const createNifiModal = ref(null)
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

const onCreateButtonClick = () => {
    createNifiModal.value.run()
}
const onUpdateButtonClick = () => {
    fetchTableData()
}

// TODO: create useTable hock to incapsulate table functionality

const items = generateTableData([
    'name',
    'tableName',
    'lastSchemaUpdate',
    'lastDataUpdate',
    'rowsCount',
    'nextDataUpdate',
])

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
            <va-button
                @click="onUpdateButtonClick"
                preset="plain"
                color="info"
            >
                <template #append>
                    <va-icon size="large" class="material-icons-outlined">
                        change_circle
                    </va-icon>
                </template>
            </va-button>
            <va-button
                @click="onCreateButtonClick"
                preset="plain"
                color="info"
            >
                <template #append>
                    <va-icon size="large" class="material-icons-outlined">
                        add_box
                    </va-icon>
                </template>
            </va-button>
        </div>
    </section>
    <va-data-table
        :loading="isLoading"
        class="app-table"
        :items="tableData"
        :columns="columns"
    >
    </va-data-table>

    <create-nifi-modal
        ref="createNifiModal"
    />
</template>

<style lang="scss" scoped>
.control-panel {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.buttons-container {
    display: flex;
    gap: 0.5rem;
}
</style>