<script setup>
import { generateTableData } from '@/helpers/generateMocks'
import { getEventsTableData} from '@/api'
import { ref, onMounted } from 'vue';
import { useErrorHandler } from '../../../composables'

const isLoading = ref(false)
const tableData = ref([])
const showCopiedMessage = ref(false)
const { handleError } = useErrorHandler();

const fetchTableData = async () => {
    try {
        isLoading.value = true
        tableData.value = await getEventsTableData()
    } catch (e) {
        handleError(e);
    } finally {
        isLoading.value = false
    }
}

const onCreateButtonClick = () => {
    // Temp refresh
    fetchTableData()
    console.log('onCreateButtonClick')
}

onMounted(() => {
    fetchTableData()
})

const copyToClipboard = (event) => {
    var str = event.target.innerHTML;
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
        <div class="buttons-container">
            <va-button @click="onCreateButtonClick" title="Create" preset="plain">
                <template #append>
                    <!-- <va-icon size="large" class="material-icons-outlined">
                        add_box
                    </va-icon> -->
                    <!-- 
                        START
                        To remove later
                    -->
                    <va-icon size="large" class="material-icons-outlined">
                        change_circle
                    </va-icon>
                    <!-- 
                        To remove later
                        END
                    -->
                </template>
            </va-button>
        </div>
    </section>
    <va-data-table 
        class="app-table" 
        :items="tableData" 
        :columns="columns" 
        :loading="isLoading" 
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
    overflow-x: hidden;
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