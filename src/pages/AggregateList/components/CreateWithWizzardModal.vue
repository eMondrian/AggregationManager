<script setup>
import { computed, ref, watch } from 'vue';
import MonacoEditor from './MonacoEditor.vue';
import { usePromisifiedModal } from '@/composables'

const { isOpened, run, close } = usePromisifiedModal();

const initialState = {
    steps: [
        { label: 'Properties' },
        { label: 'Query' },
        { label: 'Schedule' },
    ],
    activeStep: 0,
    propertiesData: {
        title: '',
        tableName: '',
        otherProps: '',
    },
    queryDefaultValue: '// Type code here...\n',
    scheduleData: {
        some: '',
        timers: '',
        here: '',
    }
}

const steps = ref([...initialState.steps])
const activeStep = ref(initialState.activeStep)
const propertiesData = ref({ ...initialState.propertiesData })
const query = ref(initialState.queryDefaultValue)
const scheduleData = ref({ ...initialState.scheduleData })

const onUnmountEditor = (value) => {
    query.value = value
}

const isPropertiesReadyToSave = computed(() => Object.values(propertiesData.value).every((value) => value !== ''))
watch(isPropertiesReadyToSave, (isReady) => steps.value[0].icon = isReady ? 'done' : undefined)

const isQueryReadyToSave = computed(() => (query.value !== initialState.queryDefaultValue) && (query.value !== ''))
watch(isQueryReadyToSave, (isReady) => steps.value[1].icon = isReady ? 'done' : undefined)

const isScheduleDataReadyToSave = computed(() => Object.values(scheduleData.value).every((value) => value !== ''))
watch(isScheduleDataReadyToSave, (isReady) => steps.value[2].icon = isReady ? 'done' : undefined)

const isReadyToSave = computed(() => isPropertiesReadyToSave.value && isQueryReadyToSave.value && isScheduleDataReadyToSave.value)

const resetState = () => {
    activeStep.value = initialState.activeStep
    propertiesData.value = { ...initialState.propertiesData }
    query.value = initialState.editorDefaultInputValue
    scheduleData.value = { ...initialState.scheduleData }
}

const onSave = async () => {
    console.log('Properties Data: ', { ...propertiesData.value })
    console.log('Query: ', { query: query.value })
    console.log('Schedule Data: ', { ...scheduleData.value })

    resetState()
    close()
}

const onClose = () => {
    close()
    resetState()
}

defineExpose({ run })
</script>

<template>
    <va-modal :modelValue="isOpened" size="large" noPadding hide-default-actions class="full-size-modal">
        <template #header>
            <section class="modal-header">
                <h2>
                    Create Aggregation
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
                                <va-input v-model="propertiesData.title" placeholder="Title" />
                                <va-input v-model="propertiesData.tableName" placeholder="Table name" />
                                <va-input v-model="propertiesData.otherProps" placeholder="Other properties" />
                            </div>
                        </section>
                    </template>
                    <template #step-content-1>
                        <section class="tab-content">
                            <monaco-editor :initialInputValue="query" :onUnmount="onUnmountEditor" />
                        </section>
                    </template>
                    <template #step-content-2>
                        <section class="tab-content">
                            <div class="properties-inputs-wrapper">
                                <va-input v-model="scheduleData.some" placeholder="Some" />
                                <va-input v-model="scheduleData.timers" placeholder="Timers" />
                                <va-input v-model="scheduleData.here" placeholder="Here" />
                            </div>
                        </section>
                    </template>
                    <template #controls="{ nextStep, prevStep }">
                        <div class="controll-buttons">
                            <va-button @click="prevStep()" :disabled="activeStep === 0">Previous</va-button>
                            <va-button v-if="activeStep !== steps.length - 1" @click="nextStep()">Next</va-button>
                            <va-button v-else @click="onSave()" :disabled="!isReadyToSave">Save</va-button>
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
    min-height: 400px;
    margin-top: 1rem;
    padding: 1rem;
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