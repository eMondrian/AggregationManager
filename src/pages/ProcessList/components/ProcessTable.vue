<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { getEventsTableData} from '@/api'
import { useErrorHandler } from '@/composables'
import { setIntervalAsync, sortNumbers } from '@/helpers'
import CustomTooltip from '@/pages/AggregateList/components/CustomTooltip.vue';

const intervalTime = 300000 // 30sec
const clearInterval = ref(null)
const tableData = ref([])
const isTableDataLoading = ref(false)
const showCopiedMessage = ref(false)
const filterValue = ref('')
const { handleError } = useErrorHandler();

const fetchTableData = async () => {
    try {
        isTableDataLoading.value = true
        const data = await getEventsTableData()
        tableData.value = data;
    } catch (e) {
        handleError(e);
    } finally {
        isTableDataLoading.value = false
    }
}

onMounted(() => {
    clearInterval.value = setIntervalAsync(fetchTableData, intervalTime)
})

onUnmounted(() => {
    clearInterval.value()
})

const onUpdateButtonClick = () => {
    clearInterval.value()
    clearInterval.value = setIntervalAsync(fetchTableData, intervalTime)
}

const copyToClipboard = (text) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);

    showCopiedMessage.value = true;

    setTimeout(() => {
        showCopiedMessage.value = false;
    }, 3000);
}

const columns = [
    { field: "aggregationName", sortable: true, pinned: 'left', flex: 1, maxWidth: 200, minWidth: 150 },
    { field: "eventType", sortable: true, flex: 1, maxWidth: 200, minWidth: 150 },
    { 
        field: "dateTime", 
        sortable: true, flex: 1, 
        maxWidth: 200, 
        minWidth: 150, 
        sort: 'desc', 
        comparator: sortNumbers, 
        valueFormatter: data => data.value.toLocaleString()
    },
    { 
        field: "eventMessage", 
        sortable: true, 
        flex: 7,
        tooltipField: 'eventMessage',
        tooltipComponentParams: { copyToClipboard }
    },
]

const gridOptions = {
    suppressMovableColumns: true,
    components: {
        customTooltip: CustomTooltip
    },
    defaultColDef: {
        tooltipComponent: 'customTooltip'
    },
    tooltipShowDelay: 0,
    tooltipInteraction: true
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
        <h2>List of events</h2>
        <div class="buttons-container">
            <va-button @click="onUpdateButtonClick" preset="plain" :disabled="isTableDataLoading">
                <template #append>
                    <va-icon
                        size="large"
                        :class = "{
                            'material-icons-outlined': true,
                            'app-spinned-icon': isTableDataLoading
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
        :loading="isTableDataLoading"
        class="ag-theme-vuestic"
        style="height: 100%;"
        :rowData="tableData"
        :columnDefs="columns"
        :quickFilterText="filterValue"
        :gridOptions="gridOptions"
        :rowSelection="rowSelection"
        :autoSizeStrategy="autoSizeStrategy"
    >
    </ag-grid-vue>

    <teleport to="body">
        <div class="success-alert">
            <va-alert
                v-model="showCopiedMessage"
                closeable
                color="success"
                class="mb-6"
            >
                Event Message was copied to clipboard
            </va-alert>
        </div>
    </teleport>
</template>

<style lang="scss" scoped>
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
    gap: 1rem;
}
</style>

<style lang="css">
.success-alert {
    z-index: 2000;
    display: flex;
    flex-direction: column;
    position: absolute;
    bottom: 0;
    width: 100%;
    bottom: 20px;
}
</style>