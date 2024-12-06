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
    { field: "aggregationName", sortable: true, pinned: 'left' },
    { field: "eventType", sortable: true, minWidth: 120 },
    { 
        field: "dateTime", 
        sortable: true, 
        sort: 'desc', 
        comparator: sortNumbers, 
        minWidth: 150,
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
    tooltipInteraction: true,
    enableCellTextSelection: true,
};

const rowSelection = {
    mode: 'singleRow',
    checkboxes: false,
    enableClickSelection: true,
}

const autoSizeStrategy = {
    type: 'fitCellContents',
};
</script>

<template>
    <section class="control-panel">
        <h2>List of events</h2>
        <div class="buttons-container">
            <va-button @click="onUpdateButtonClick" preset="plain" :disabled="isTableDataLoading" size="large">
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

:deep() .ag-header-cell:last-child .ag-header-cell-resize::before {
    display: none;
}

:deep() .ag-header-cell-resize::before {
    content: "";
    position: absolute;
    z-index: 1;
    display: block;
    width: var(--ag-header-column-resize-handle-width);
    height: var(--ag-header-column-resize-handle-height);
    top: calc(50% - var(--ag-header-column-resize-handle-height)* 0.5);
    background-color: var(--ag-header-column-resize-handle-color);
}


:deep() .ag-cell {
    display: flex;
    align-items: center;
}

:deep() .ag-body-horizontal-scroll-viewport,
:deep() .ag-body-vertical-scroll-viewport {
    scrollbar-width: unset;
    scrollbar-color: silver transparent;
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