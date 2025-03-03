<script setup>
import { ref, watch, computed, nextTick } from 'vue';
import cloneDeep from 'lodash/cloneDeep';
import { getProcesses, getTemplates, getSettings, getAggregationHistoryItem } from '@/api'
import { usePromisifiedModal, useErrorHandler } from '@/composables'
import { sortNumbers } from '@/helpers'
import InputWithOptions from '@/components/InputWithOptions/InputWithOptions.vue'
import CreateAggregationActionModal from './CreateAggregationActionModal.vue';
import CreateAggregationJsonModal from './CreateAggregationJsonModal.vue';
import HistoryActionsButtons from './HistoryActionsButtons.vue';
import MonacoEditor from './MonacoEditor.vue';
import { HISTORY_JSON_MOCK } from '@/mocks/static';
import { HISTORY_ACTION_TYPES } from '@/constants/constants';

const { handleError } = useErrorHandler();

const TABS_TITLE = {
    PROPERTIES: 'Properties',
    TEMPLATE: 'Template',
    QUERY: 'Query',
    SCHEDULE: 'Schedule',
    HISTORY: 'History'
}

const cronScheduleOptions = [
    {
        text: 'Every day, 8AM, 8PM',
        value: '0 0 8,20 * * ?'
    },
    {
        text: 'MON-FRI, 2:20PM',
        value: '0 20 14 ? * MON-FRI'
    }
]

const timerScheduleOptions = [
    {
        value: '30 sec',
        text: 'Every 30 sec',
    },
    {
        value: '10 min',
        text: 'Every 10 min',
    },
    {
        value: '1 hour',
        text: 'Every hour',
    },
    {
        value: '1 day',
        text: 'Every day',
    },
    {
        value: '1 week',
        text: 'Every week',
    }
];

const initialState = {
    tabs: [
        { title: TABS_TITLE.PROPERTIES, icon: 'list_alt' },
        { title: TABS_TITLE.TEMPLATE, icon: 'edit_document' },
        { title: TABS_TITLE.QUERY, icon: 'code' },
        { title: TABS_TITLE.SCHEDULE, icon: 'schedule' },
        { title: TABS_TITLE.HISTORY, icon: 'history'}
    ],
    activeTab: TABS_TITLE.PROPERTIES,
    propertiesData: {
        id: '',
        name: '',
        tableName: '',
        nifiProcessId: '',
        generated: true,
    },
    templateId: '',
    queryDefaultValue: '',
    scheduleData: {
        schedule: '1 day',
        strategy: 'TIMER_DRIVEN'
    },
    historyTableData: []
}

const activeTab = ref(initialState.activeTab)
const propertiesData = ref(cloneDeep(initialState.propertiesData))
const templateId = ref(cloneDeep(initialState.templateId))
const query = ref(initialState.queryDefaultValue)
const scheduleData = ref(cloneDeep(initialState.scheduleData))
const historyTableData = ref(cloneDeep(initialState.historyTableData))
const templateOptions = ref([]);
const processesListLoading = ref(false);
const processesList = ref([]);
const isEdit = ref(false);
const createAggregationActionModal = ref(null)
const createAggregationJsonModal = ref(null);
let inited = false;

const tabs = computed(() => {
    if (isEdit.value) {
        return initialState.tabs.filter(({ title }) => title !== TABS_TITLE.TEMPLATE)
    }

    return initialState.tabs.filter(({ title }) => title !== TABS_TITLE.HISTORY)
})

const resetState = () => {
    activeTab.value = initialState.activeTab
    propertiesData.value = cloneDeep(initialState.propertiesData)
    templateId.value = initialState.templateId
    query.value = initialState.queryDefaultValue
    scheduleData.value = cloneDeep(initialState.scheduleData)
    historyTableData.value = cloneDeep(initialState.historyTableData)

    processesListLoading.value = false
    isEdit.value = false;
}

const { isOpened, run, close } = usePromisifiedModal({
    opened: async (data) => {
        inited = false;
        console.log(data);
        if (data) {
            propertiesData.value.id = data.id
            propertiesData.value.tableName = data.table_name;
            propertiesData.value.name = data.aggregation_name;
            propertiesData.value.generated = data.is_generated_nifi_process === 't';
            propertiesData.value.nifiProcessId = data.start_nifi_process_id;

            query.value = data.query;

            scheduleData.value.strategy = data.scheduling_strategy;
            scheduleData.value.schedule = data.scheduling_period;
            console.log(scheduleData.value.schedule);

            historyTableData.value = data.history_items;

            isEdit.value = true;
        }

        try {
            const settingsData = await getSettings();
            templateId.value = settingsData.default_template_id;

            const availableTemplates = await getTemplates();
            templateOptions.value = [...availableTemplates]
        } catch (e) {
            handleError(e);
        }

        try {
            processesListLoading.value = true;
            const processes = await getProcesses();

            processesList.value = [{
                name: 'None',
                value: null,
            }];
            processesList.value.push(...processes.map((e) => {
                return {
                    name: e.name,
                    value: e.id
                }
            }))
        } catch (e) {
            handleError(e);
        } finally {
            processesListLoading.value = false;
        }

        await nextTick();
        inited = true;
    },
    resetFn: resetState,
});

const onEditorChange = (value) => {
    query.value = value
}

const onSave = async () => {
    close({
        propertiesData: propertiesData.value,
        templateId: templateId.value,
        query: query.value,
        scheduleData: scheduleData.value
    })
}

watch(() => scheduleData.value.strategy, () => {
    if (!inited) return;
    console.log("Reset");
    scheduleData.value.schedule = '';
})

const onClose = () => {
    close()
}

const downloadJson = (data) => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'data.json';
    document.body.appendChild(link);
    link.click();

    URL.revokeObjectURL(url);
    document.body.removeChild(link);
};

const onAction = async (id, actionType) => {
    try {
        switch (actionType) {
            case HISTORY_ACTION_TYPES.SEARCH:
                const historyItem = await getAggregationHistoryItem(id);
                await createAggregationActionModal.value.run(historyItem);
                break;
            
            case HISTORY_ACTION_TYPES.CODE:
                const jsonData = JSON.stringify(HISTORY_JSON_MOCK, null, 2);
                await createAggregationJsonModal.value.run(jsonData);
                break;

            case HISTORY_ACTION_TYPES.DOWNLOAD:
                downloadJson(HISTORY_JSON_MOCK);
                break;

            default:
                // error is needed for developers if we forgot to add something
                throw new Error("Unknown action type");
        }
    } catch (e) {
        handleError(e);
    }
};

defineExpose({ run })
</script>

<template>
    <va-modal :modelValue="isOpened" size="large" fixed-layout noPadding hide-default-actions class="full-size-modal">
        <template #header>
            <section class="modal-header">
                <h2>
                    {{ isEdit ? 'Edit' : 'Create' }} Aggregation
                </h2>
                <va-button preset="plain" title="Close" @click="onClose">
                    <template #append>
                        <va-icon class="material-icons-outlined">
                            close
                        </va-icon>
                    </template>
                </va-button>
            </section>
        </template>
        <template #default>
            <section class="modal-content">
                <va-tabs v-model="activeTab" grow class="full-size-tabs">
                    <template #tabs>
                        <va-tab v-for="tab in tabs" :key="tab.title" :name="tab.title" :disabled="tab.title === TABS_TITLE.QUERY && !propertiesData.generated">
                            <div class="tab-title">
                                <va-icon class="material-icons">
                                    {{ tab.icon }}
                                </va-icon>
                                {{ tab.title }}
                            </div>
                        </va-tab>
                    </template>
                    <template #default>
                        <section v-if="activeTab===TABS_TITLE.PROPERTIES" class="tab-content">
                            <div class="properties-inputs-wrapper">
                                <div v-if="propertiesData.id!==''" class="info-label-wrapper">
                                    <span class="info-label">Aggregation ID: </span><span>{{ propertiesData.id }}</span>
                                </div>
                                <va-input v-model="propertiesData.name" label="Name" />
                                <va-input v-model="propertiesData.tableName" label="Table name" />
                                <va-select
                                    ref="nifiProcessSelect" 
                                    v-model="propertiesData.nifiProcessId" 
                                    label="NIFI process" 
                                    text-by="name"
                                    value-by="value"
                                    :disabled="propertiesData.generated"
                                    :loading="processesListLoading"
                                    :options="processesList"
                                    prevent-overflow
                                />
                            </div>
                        </section>
                        <section v-if="activeTab===TABS_TITLE.TEMPLATE" class="tab-content">
                            <div class="properties-inputs-wrapper">
                                <InputWithOptions
                                    v-model="templateId"
                                    label="Template"
                                    :options="templateOptions"
                                    optionsTextBy="name"
                                    optionsValueBy="id"
                                />
                            </div>
                        </section>
                        <section v-if="activeTab===TABS_TITLE.QUERY" class="tab-content">
                            <monaco-editor :initialInputValue="query" :onChange="onEditorChange" />
                        </section>
                        <section v-if="activeTab===TABS_TITLE.SCHEDULE" class="tab-content">
                            <div class="properties-inputs-wrapper">
                                <InputWithOptions
                                    v-model="scheduleData.schedule"
                                    label="Schedule"
                                    :options="scheduleData.strategy === 'CRON_DRIVEN' ? cronScheduleOptions : timerScheduleOptions"
                                    optionsTextBy="text"
                                    optionsValueBy="value"
                                />
                                <va-select
                                    v-model="scheduleData.strategy" 
                                    label="Scheduling strategy" 
                                    :options="['TIMER_DRIVEN', 'CRON_DRIVEN']"
                                    prevent-overflow
                                />
                            </div>
                        </section>

                        <section v-if="activeTab===TABS_TITLE.HISTORY" class="tab-content">
                            <ag-grid-vue
                                class="ag-theme-vuestic"
                                key="qwe"
                                style="width: 100%; height: 500px;"
                                :rowData="historyTableData"
                                :columnDefs="[
                                    { field: 'id', pinned: 'left', sortable: true },
                                    { headerName: 'last modified by', field: 'last_modified_by', sortable: true, cellDataType: 'text' },
                                    { headerName: 'last schema update', field: 'last_schema_update', sortable: true, comparator: sortNumbers, valueFormatter: data => data.value.toLocaleString() },
                                    { field: 'actions', sortable: false, width: 100, cellRenderer: HistoryActionsButtons }
                                ]"
                                :gridOptions="{
                                    suppressMovableColumns: true,
                                    onCellClicked: (event) => {
                                        if (event.colDef.field === 'actions') {
                                            const actionData = event.data.id;
                                            const target = event.event.target.closest('[data-action]');

                                            if (target) {
                                                const actionType = target.dataset.action; 

                                                onAction(actionData, actionType);
                                            }
                                        }
                                    }
                                }"
                                :rowSelection="{
                                    mode: 'singleRow',
                                    checkboxes: false,
                                    enableClickSelection: true,
                                }"
                                :autoSizeStrategy="{
                                    type: 'fitGridWidth',
                                }"
                            >
                            </ag-grid-vue>
                        </section>
                    </template>
                </va-tabs>
            </section>
        </template>
        <template #footer>
            <div class="controll-buttons">
                <va-button @click="onSave()">
                    Save
                </va-button>
            </div>
        </template>
    </va-modal>

    <teleport to="body">
        <create-aggregation-action-modal ref="createAggregationActionModal" />
        <create-aggregation-json-modal ref="createAggregationJsonModal" />
    </teleport>
</template>

<style lang="scss" scoped>
.modal-header {
    padding: 1rem 2rem;
    border-bottom: 1px solid var(--va-info);
    display: flex;
    align-items: center;
    justify-content: space-between;
    align-items: center;
}

.modal-content {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.tab-title {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
}

.tab-content {
    width: 100%;
    height: 60vh;
    margin-top: 1rem;
    padding: 1rem;
}

.properties-inputs-wrapper {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.controll-buttons {
    padding: 1.5rem;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
}

.info-label-wrapper {
    display: flex;
    gap: 1rem;
}

.info-label {
    font-weight: bold;
    color: var(--va-info);
}
</style>