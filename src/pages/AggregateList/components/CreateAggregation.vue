<script setup>
import isEmpty from 'lodash/isEmpty'
import cloneDeep from 'lodash/cloneDeep';
import { computed, ref, watch } from 'vue';
import { createAggregation } from '@/api'
import { usePromisifiedModal } from '@/composables'

const { isOpened, run, close } = usePromisifiedModal();

const initialState = {
    steps: [
        { label: 'Select table', icon: 'list_alt' },
        { label: 'Select columns', icon: 'table_chart', disabled: true },
    ],
    activeStep: 0,
    tableData: {
        name: '',
        tableName: '',
    },
    selectedColumns: [],
    isAnaliticStarted: false
}

const steps = ref(cloneDeep(initialState.steps))
const activeStep = ref(initialState.activeStep)
const tableData = ref(cloneDeep(initialState.tableData))
const selectedColumns = ref(cloneDeep(initialState.selectedColumns))
const isAnaliticStarted = ref(initialState.isAnaliticStarted)
const isRequestInProcess = ref(false)

const isTableDataReadyToSave = computed(() => Object.values(tableData.value).every((value) => value !== ''))
watch(isTableDataReadyToSave, (isReady) => {
    steps.value[0].icon = isReady ? 'done' : initialState.steps[0].icon
    steps.value[1].disabled = !isReady
})

const isSelectedColumnsReadyToSave = computed(() => !isEmpty(selectedColumns.value))
watch(isSelectedColumnsReadyToSave, (isReady) => steps.value[1].icon = isReady ? 'done' : initialState.steps[1].icon)

const isReadyToSave = computed(() => isTableDataReadyToSave.value && isSelectedColumnsReadyToSave.value)

const startPerfomanceAnalitic = () => {
    isAnaliticStarted.value = true
}

const stopPerfomanceAnalitic = () => {
    isAnaliticStarted.value = false
}

const resetState = () => {
    steps.value = cloneDeep(initialState.steps)
    activeStep.value = initialState.activeStep
    tableData.value = cloneDeep(initialState.tableData)
    selectedColumns.value = cloneDeep(initialState.selectedColumns)
    isAnaliticStarted.value = initialState.isAnaliticStarted
}

const onSave = async () => {
    try {
        isRequestInProcess.value = true

        await createAggregation({ tableData: tableData.value, selectedColumns: selectedColumns.value })
    } finally {
        isRequestInProcess.value = false
        close()
        resetState()
    }
}

const onClose = () => {
    close()
    resetState()
}

const aggregationColumns = [
    { key: "selected", sortable: true },
    { key: "name", sortable: true },
    { key: "type", sortable: true },
    { key: "other", sortable: true }
]

const aggregationColumnsData = ref([
    {
        selected: 'selected-1',
        name: 'name-1',
        type: 'type-1'
    },
    {
        selected: 'selected-2',
        name: 'name-2',
        type: 'type-2'
    },
    {
        selected: 'selected-3',
        name: 'name-3',
        type: 'type-3'
    },
])

const mockedTableNameOptions = ref([
    {
        text: 'Table 1',
        value: 'table-1'
    },
    {
        text: 'Table 2',
        value: 'table-2'
    }
])

defineExpose({ run })
</script>

<template>
    <va-modal :modelValue="isOpened" size="large" noPadding hide-default-actions class="full-size-modal">
        <template #header>
            <section class="modal-header">
                <h2>
                    Create Aggregate Wizzard
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
                            <div class="table-data-inputs-wrapper">
                                <va-input v-model="tableData.name" label="Name" />
                                <va-select v-model="tableData.tableName" label="Table name" text-by="text"
                                    :options="mockedTableNameOptions" />
                            </div>
                        </section>
                    </template>
                    <template #step-content-1>
                        <section class="tab-content">
                            <va-data-table v-model="selectedColumns" :items="aggregationColumnsData"
                                :columns="aggregationColumns" selectable select-mode="multiple" />
                            <section class="perfomance-section">
                                <h3>Perfomance</h3>
                                <div class="rows-info">
                                    <p>Rows count:</p><span class="rows-count-number">1234</span>
                                </div>
                                <div class="perfomance-controll-buttons">
                                    <va-button @click="startPerfomanceAnalitic" :disabled="isAnaliticStarted">Start
                                        Analytics</va-button>
                                    <va-button @click="stopPerfomanceAnalitic" :disabled="!isAnaliticStarted"
                                        preset="primary">Stop</va-button>
                                </div>
                            </section>
                        </section>
                    </template>
                    <template #controls="{ nextStep, prevStep }">
                        <div class="controll-buttons">
                            <va-button @click="prevStep()" :disabled="activeStep === 0">Previous</va-button>
                            <va-button v-if="activeStep !== steps.length - 1" @click="nextStep()"
                                :disabled="!isTableDataReadyToSave">Next</va-button>
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
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 1rem;
}

.table-data-inputs-wrapper {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.perfomance-section {
    padding: 1rem;
    border-radius: 0.5rem;
    background-color: #eeeeee;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .rows-info {
        display: flex;
        gap: 1rem;

        .rows-count-number {
            color: var(--va-info);
        }
    }

    .perfomance-controll-buttons {
        display: flex;
        gap: 1rem;
    }
}

.controll-buttons {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
}
</style>