<script setup>
import { getEventsTableData} from '@/api'
import { ref, onMounted } from 'vue';
import { useErrorHandler } from '@/composables'
import { setIntervalAsync } from '@/helpers'

const fetchTableDataInterval = 30000 // 30sec

const tableData = ref([])
const showCopiedMessage = ref(false)
const { handleError } = useErrorHandler();

const fetchTableData = async () => {
    try {
        tableData.value = await getEventsTableData()
    } catch (e) {
        handleError(e);
    }
}

onMounted(async () => {
    setIntervalAsync(fetchTableData, fetchTableDataInterval)
})

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
    { key: "dateTime", sortable: true, width: '15%' },
    { key: "eventMessage", sortable: true, width: '55%' },
];
</script>

<template>
    <section class="control-panel">
        <h2>List of events</h2>
    </section>
    <!-- table loader has incorrect displaing in centre of content but not of table -->
    <va-data-table 
        class="app-table" 
        :items="tableData" 
        :columns="columns" 
        sticky-header
        height="100%"
        :scroll-bottom-margin="40"
    > 
        <template #cell(eventMessage)="data">
            <va-popover 
                :placement="data.rowIndex < 5 ? 'bottom-left' : 'top-left'"
                prevent-overflow
                :message="data.rowData.eventMessage"
                style="z-index: 1000;"
            >
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
    // overflow-x: hidden;
}
.control-panel {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.buttons-container {
    display: flex;
    gap: 1rem;
}

.event-message {
    // Todo: Test in perspective overflow ellipsis;
    // ~start~
    max-width: 55vw;
    overflow: hidden;
    text-overflow: ellipsis;
    // ~end~
    cursor: pointer;
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