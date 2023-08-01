<script setup>
import cloneDeep from 'lodash/cloneDeep';
import { ref } from 'vue';
import MonacoEditor from './MonacoEditor.vue';
import { getProcesses } from '@/mocks/api'
import { usePromisifiedModal, useErrorHandler } from '@/composables'

const { handleError } = useErrorHandler();

const initialState = {
    tabs: [
        { title: 'Properties', icon: 'list_alt' },
        { title: 'Query', icon: 'code' },
        { title: 'Schedule', icon: 'schedule' },
    ],
    activeTab: 'Properties',
    propertiesData: {
        id: '',
        name: '',
        tableName: '',
        nifiProcessId: '',
        generated: true,
    },
    queryDefaultValue: '',
    scheduleData: {
        schedule: '',
        strategy: 'TIMER_DRIVEN'
    }
}

const tabs = ref(cloneDeep(initialState.tabs))
const activeTab = ref(initialState.activeTab)
const propertiesData = ref(cloneDeep(initialState.propertiesData))
const query = ref(initialState.queryDefaultValue)
const scheduleData = ref(cloneDeep(initialState.scheduleData))
const processesListLoading = ref(false);
const processesList = ref([]);
const isEdit = ref(false);

const { isOpened, run, close } = usePromisifiedModal({
    opened: async (data) => {
        console.log(data)
        if (data) {
            propertiesData.value.id = data.id
            propertiesData.value.tableName = data.table_name;
            propertiesData.value.name = data.aggregation_name;
            propertiesData.value.generated = data.is_generated_nifi_process === 't';

            query.value = data.query;

            scheduleData.value.schedule = data.scheduling_period;
            scheduleData.value.strategy = data.scheduling_strategy;

            isEdit.value = true;
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

            if (data) {
                propertiesData.value.nifiProcessId = data.start_nifi_process_id;
            }
        } catch (e) {
            handleError(e);
        } finally {
            processesListLoading.value = false;
        }
    }
});

const onUnmountEditor = (value) => {
    query.value = value
}

const resetState = () => {
    activeTab.value = initialState.activeTab
    propertiesData.value = cloneDeep(initialState.propertiesData)
    query.value = initialState.editorDefaultInputValue
    scheduleData.value = cloneDeep(initialState.scheduleData)

    isEdit.value = false;
}

const onSave = async () => {
    close({
        propertiesData: propertiesData.value,
        query: query.value,
        scheduleData: scheduleData.value
    })
}

const onClose = () => {
    close()
    resetState()
}

defineExpose({ run, resetState })
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
                        <va-tab v-for="tab in tabs" :key="tab.title" :name="tab.title">
                            <div class="tab-title">
                                <va-icon class="material-icons">
                                    {{ tab.icon }}
                                </va-icon>
                                {{ tab.title }}
                            </div>
                        </va-tab>
                    </template>
                    <template #default>
                        <section v-if="activeTab===tabs[0].title" class="tab-content">
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
                        <section v-if="activeTab===tabs[1].title" class="tab-content">
                            <monaco-editor :initialInputValue="query" :onUnmount="onUnmountEditor" />
                        </section>
                        <section v-if="activeTab===tabs[2].title" class="tab-content">
                            <div class="properties-inputs-wrapper">
                                <va-input v-model="scheduleData.schedule" label="Schedule" />
                                <va-select
                                    v-model="scheduleData.strategy" 
                                    label="Scheduling strategy" 
                                    :options="['TIMER_DRIVEN', 'CRON_DRIVEN']"
                                    prevent-overflow
                                />
                            </div>
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
    // height: 33rem;
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