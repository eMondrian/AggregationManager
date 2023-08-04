<script setup>
import sortBy from 'lodash/sortBy'
import { getEventsTableData} from '@/api'
// import { getEventsTableData} from '@/mocks/api'
import { ref, onMounted, onUnmounted } from 'vue';
import { useErrorHandler } from '@/composables'
import { setIntervalAsync, sortNumbers } from '@/helpers'

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
        tableData.value = sortBy(data, ({ dateTime }) => dateTime).reverse()
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

const copyToClipboard = (event) => {
    const str = event.target.innerHTML;
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    showCopiedMessage.value = true;

    setTimeout(() => {
        showCopiedMessage.value = false;
    }, 3000);
}

const columns = [
    { key: "aggregationName", sortable: true, width: '15%' },
    { key: "eventType", sortable: true, width: '15%' },
    { key: "dateTime", sortable: true, sortingFn: sortNumbers, width: '15%' },
    { key: "eventMessage", sortable: true, width: '55%' },
];
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
    <!-- table loader has incorrect displaing in centre of content but not of table -->
    <va-data-table
        :filter="filterValue"
        class="app-table" 
        :items="tableData" 
        :columns="columns" 
        sticky-header
        :scroll-bottom-margin="40"
        sort-by="dateTime"
    >
        <template #cell(dateTime)="data">
            <div>{{ data.rowData.dateTime.toLocaleString() }}</div>
        </template>
        <template #cell(eventMessage)="data">
            <va-popover 
                :placement="data.rowIndex < 5 ? 'bottom-left' : 'top-left'"
                prevent-overflow
                style="z-index: 1000;"
            >
            <template #body>
                <p>{{ data.rowData.eventMessage }}</p>
                <p class="popover-clipboard-message">Click to copy to clipboard</p>
            </template>

            <div class="event-message" @click="copyToClipboard($event)">{{ data.rowData.eventMessage }}</div>
            </va-popover>
        </template>
    </va-data-table>
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
.app-table {
    width: 100%;
    height: 100%;
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
    gap: 1rem;
}

.event-message {
    height: 18px;
    max-width: 55vw;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
}

.popover-clipboard-message {
    display: flex;
    justify-content: end;
    color: rgb(119, 178, 31);
}
</style>

<style lang="css">
.va-popover__body {
    max-width: 400px;
    height: auto;
    display: block;
    white-space: initial;
}

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