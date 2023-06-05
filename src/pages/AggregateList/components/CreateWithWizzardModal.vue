<script setup>
import cloneDeep from 'lodash/cloneDeep';
import { computed, ref, watch } from 'vue';
import MonacoEditor from './MonacoEditor.vue';
import { getProcesses } from '@/api'
import { usePromisifiedModal } from '@/composables'
import { useErrorHandler } from '../../../composables';

const { handleError } = useErrorHandler();

const initialState = {
    steps: [
        { label: 'Properties', icon: 'list_alt' },
        { label: 'Query', icon: 'code' },
        { label: 'Schedule', icon: 'schedule' },
    ],
    activeStep: 0,
    propertiesData: {
        name: '',
        tableName: '',
        // otherProps: '',
        nifiProcessId: '',
        generated: true,
    },
    queryDefaultValue: '',
    // scheduleData: {
    //     some: '',
    //     timers: '',
    //     here: '',
    // }
    scheduleData: {
        schedule: '',
        strategy: 'TIMER_DRIVEN'
    }
}

const steps = ref(cloneDeep(initialState.steps))
const activeStep = ref(initialState.activeStep)
const propertiesData = ref(cloneDeep(initialState.propertiesData))
const query = ref(initialState.queryDefaultValue)
const scheduleData = ref(cloneDeep(initialState.scheduleData))
const isRequestInProcess = ref(false)
const processesListLoading = ref(false);
const processesList = ref([]);
const isEdit = ref(false);

const { isOpened, run, close } = usePromisifiedModal({ opened: async (data) => {
    if (data) {
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
}});

const onUnmountEditor = (value) => {
    query.value = value
}

// const isPropertiesReadyToSave = computed(() => Object.values(propertiesData.value).every((value) => value !== ''))
const isPropertiesReadyToSave = computed(() => {
    return propertiesData.value.name !== '' && (propertiesData.value.tableName || propertiesData.value.nifiProcessName);
});
watch(isPropertiesReadyToSave, (isReady) => steps.value[0].icon = isReady ? 'done' : initialState.steps[0].icon)

const isQueryReadyToSave = computed(() => {
    if (propertiesData.value.nifiProcessName) return true;
    else return query.value !== initialState.queryDefaultValue
})
watch(isQueryReadyToSave, (isReady) => steps.value[1].icon = isReady ? 'done' : initialState.steps[1].icon)

const isScheduleDataReadyToSave = computed(() => Object.values(scheduleData.value).every((value) => value !== ''))
watch(isScheduleDataReadyToSave, (isReady) => steps.value[2].icon = isReady ? 'done' : initialState.steps[2].icon)

const isReadyToSave = computed(() => isPropertiesReadyToSave.value && isQueryReadyToSave.value && isScheduleDataReadyToSave.value)

const resetState = () => {
    steps.value = cloneDeep(initialState.steps)
    activeStep.value = initialState.activeStep
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
    // try {
    //     isRequestInProcess.value = true

    //     await createWithWizzard({
    //         propertiesData: propertiesData.value,
    //         query: query.value,
    //         scheduleData: scheduleData.value
    //     })
    // } finally {
    //     isRequestInProcess.value = false
    //     close()
    //     resetState()
    // }
}

const onClose = () => {
    close()
    resetState()
}

defineExpose({ run, resetState })
</script>

<template>
    <va-modal :modelValue="isOpened" size="large" noPadding hide-default-actions class="full-size-modal">
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
                <va-stepper v-model="activeStep" :steps="steps" controlsHidden>
                    <template #step-content-0>
                        <section class="tab-content">
                            <div class="properties-inputs-wrapper">
                                <va-input v-model="propertiesData.name" label="Name" />
                                <va-input v-model="propertiesData.tableName" label="Table name" />
                                <!-- <va-input v-model="propertiesData.otherProps" label="Other properties" /> -->
                                <!-- <va-input v-model="propertiesData.nifiProcessName" label="Nifi process name" /> -->
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
                    </template>
                    <template #step-content-1>
                        <section>
                            <monaco-editor :initialInputValue="query" :onUnmount="onUnmountEditor" />
                        </section>
                    </template>
                    <template #step-content-2>
                        <section class="tab-content">
                            <div class="properties-inputs-wrapper">
                                <va-input v-model="scheduleData.schedule" label="Schedule" />
                                <va-select
                                    ref="nifiProcessSelect" 
                                    v-model="scheduleData.strategy" 
                                    label="Scheduling strategy" 
                                    :options="['TIMER_DRIVEN', 'CRON_DRIVEN']"
                                    prevent-overflow
                                />
                                <!-- <va-input v-model="scheduleData.some" label="Some" />
                                <va-input v-model="scheduleData.timers" label="Timers" />
                                <va-input v-model="scheduleData.here" label="Here" /> -->
                            </div>
                        </section>
                    </template>
                    <template #controls="{ nextStep, prevStep }">
                        <div class="controll-buttons">
                            <va-button @click="prevStep()" :disabled="activeStep === 0">Previous</va-button>
                            <va-button v-if="activeStep !== steps.length - 1" @click="nextStep()">Next</va-button>
                            <va-button v-else @click="onSave()" :disabled="!isReadyToSave"
                                :loading="isRequestInProcess">Save</va-button>
                        </div>
                    </template>
                </va-stepper>
            </section>
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
}

.modal-content {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.tab-content {
    width: 100%;
    min-height: 33rem;
    margin-top: 1rem;
}

.properties-inputs-wrapper {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.controll-buttons {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
}
</style>