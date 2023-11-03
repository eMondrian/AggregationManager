<script setup>
import isEmpty from 'lodash/isEmpty'
import cloneDeep from 'lodash/cloneDeep';
import { computed, ref, watch } from 'vue';
import { usePromisifiedModal, useErrorHandler } from '@/composables'
import { getTableList, getColumnsList, getQuery } from '@/api';
import InputWithOptions from '@/components/InputWithOptions/InputWithOptions.vue'
import { getQueryPerformance } from '../../../api';


const props = defineProps(['onSave'])
const { handleError } = useErrorHandler();

const initialState = {
    steps: [
        { label: 'Select table', icon: 'list_alt' },
        { label: 'Select columns', icon: 'table_chart', disabled: true },
        { label: 'Schedule', icon: 'schedule', disabled: true },
    ],
    activeStep: 0,
    // TODO: Tables have unique names, no need for complex objects
    aggregationName: '',
    tableName: '',
    tableData: null,
    selectedColumns: [],
    isAnaliticStarted: false,
    scheduleData: {
        schedule: '',
        strategy: 'TIMER_DRIVEN'
    },
    columnsFilter: '',
}

const steps = ref(cloneDeep(initialState.steps))
const activeStep = ref(initialState.activeStep)
const aggregationName = ref(initialState.aggregationName)
const tableName = ref(initialState.tableName)
const tableData = ref(initialState.tableData)
const selectedColumns = ref(cloneDeep(initialState.selectedColumns))
const isAnaliticStarted = ref(initialState.isAnaliticStarted)
const columnsFilter = ref(initialState.columnsFilter)
const isRequestInProcess = ref(false)

const tableList = ref([]);
const tableListLoading = ref(false);

const aggregationColumnsData = ref([]);
const aggregationColumnsDataLoading = ref(false);

const scheduleData = ref(cloneDeep(initialState.scheduleData))

const isTableDataReadyToSave = computed(() => aggregationName.value && tableData.value);
const isQueryConfigured = computed(() => selectedColumns.value.length);

const stepper = ref(null);

const perfomanceStats = ref({
    rowsCount: null,
    time: null,
})

const prevStep = () => {
    console.log(stepper);
    stepper.value.stepControls.prevStep();
}
const nextStep = () => {
    console.log(stepper);
    stepper.value.stepControls.nextStep();
}

const fetchTablesList = async () => {
    try {
        tableListLoading.value = true
        const result = await getTableList();
        tableList.value.push(...result);
    } catch (e) {
        handleError(e);
    } finally {
        tableListLoading.value = false
    }
}

const fetchColumns = async (table) => {
    try {
        aggregationColumnsDataLoading.value = true
        const result = await getColumnsList(table);

        aggregationColumnsData.value.push(
            ...result.map((e) => {
                return {
                    name: e.name,
                    type: e.type,
                    role: null,
                    aggregate_function: null,
                }
            })
        )
    } catch (e) {
        handleError(e);
    } finally {
        aggregationColumnsDataLoading.value = false
    }
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
        text: 'Every hour',
    }
];

const { isOpened, run, close } = usePromisifiedModal({
    opened: () => {
        fetchTablesList();
    }
});

watch(activeStep, (currentStep) => {
    if (currentStep === 1) {
        fetchColumns(tableData.value);
    }
});

watch(isTableDataReadyToSave, (isReady) => {
    steps.value[0].icon = isReady ? 'done' : initialState.steps[0].icon
    steps.value[1].disabled = !isReady
})
watch(isQueryConfigured, (isReady) => {
    steps.value[1].icon = isReady ? 'done' : initialState.steps[1].icon
    steps.value[2].disabled = !isReady
})

watch(() => scheduleData.value.strategy, () => {
    scheduleData.value.schedule = '';
})

const isSelectedColumnsReadyToSave = computed(() => !isEmpty(selectedColumns.value))
watch(isSelectedColumnsReadyToSave, (isReady) => steps.value[1].icon = isReady ? 'done' : initialState.steps[1].icon)

const isReadyToSave = computed(() => isTableDataReadyToSave.value && isSelectedColumnsReadyToSave.value)

let analyticsInterval = null;
let requestController = null; 

const stopPerfomanceAnalitic = () => {
    requestController.abort();
    requestController = null;

    clearInterval(analyticsInterval);
    analyticsInterval = null;

    isAnaliticStarted.value = false;
    perfomanceStats.value.time = null;
    perfomanceStats.value.rowsCount = null;
}
const startPerfomanceAnalitic = async () => {
    try {
        perfomanceStats.value.time = null;
        perfomanceStats.value.rowsCount = null;

        isAnaliticStarted.value = true;

        const request = {
            database: tableData.value.database,
            table: tableData.value.name,
            columns: selectedColumns.value.map((e) => {
                return {
                    name: e.name,
                    type: e.role,
                    aggregate_function: e.aggregate_function
                }
            }),
        }

        const { query } = await getQuery(request);

        const analysisTimerStarted = Date.now()

        analyticsInterval = setInterval(() => {
            const curTime = Date.now()
            const duration = (curTime - analysisTimerStarted) / 1000

            perfomanceStats.value.time = duration
        }, 1000);
        
        requestController = new AbortController();
        const result = await getQueryPerformance(query, requestController);
        const analysisTimerEnded = Date.now()

        clearInterval(analyticsInterval);

        const duration = (analysisTimerEnded - analysisTimerStarted) / 1000

        console.log("duration", duration);
        console.log("result", result.rows_count);
        perfomanceStats.value.time = duration
        perfomanceStats.value.rowsCount = result.rows_count
    } catch (e) {
        handleError(e);
    } finally {
        isAnaliticStarted.value = false
    }

}

const resetState = () => {
    steps.value = cloneDeep(initialState.steps)
    activeStep.value = initialState.activeStep
    aggregationName.value = initialState.aggregationName
    tableName.value = initialState.tableName
    tableData.value = initialState.tableData
    selectedColumns.value = cloneDeep(initialState.selectedColumns)
    scheduleData.value = cloneDeep(initialState.scheduleData)
    isAnaliticStarted.value = initialState.isAnaliticStarted
    columnsFilter.value = initialState.columnsFilter
    aggregationColumnsData.value = []
    tableList.value = []
}


const onClose = () => {
    close()
    resetState()
}

const onSave = async () => {
    try {
        isRequestInProcess.value = true;
        
        const request = {
            database: tableData.value.database,
            table: tableData.value.name,
            columns: selectedColumns.value.map((e) => {
                return {
                    name: e.name,
                    type: e.role,
                    aggregate_function: e.aggregate_function
                }
            }),
        }
        
        const { query } = await getQuery(request);
        isRequestInProcess.value = false;

        close()

        await props.onSave({
            query,
            is_generated_nifi_process: true,
            aggregation_name: aggregationName.value,
            table_name: tableName.value,
            name: aggregationName.value,
            scheduling_period: scheduleData.value.schedule,
            scheduling_strategy: scheduleData.value.strategy,
        })
        resetState();
    } catch (e) {
        handleError(e);
        run();
    }
}

const aggregationColumns = [
    { key: "name", sortable: true, width: "40%" },
    { key: "type", sortable: true, width: "15%" },
    { key: "role", sortable: false, width: "15%" },
    { key: "aggregate_function", sortable: false, width: "30%" }
]

defineExpose({ run, resetState })
</script>

<template>
    <va-modal :modelValue="isOpened" size="large" noPadding hide-default-actions fixed-layout class="full-size-modal">
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
                <va-stepper v-model="activeStep" :steps="steps" controlsHidden ref="stepper">
                    <template #step-content-0>
                        <section class="tab-content">
                            <div class="table-data-inputs-wrapper">
                                <va-input v-model="aggregationName" label="Name" />
                                <va-input v-model="tableName" label="Table Name" />
                                <va-select v-model="tableData" label="Source table name" :text-by="(option) => `${option.database}.${option.name}`"
                                    :options="tableList" prevent-overflow :loading="tableListLoading">
                                </va-select>
                            </div>
                        </section>
                    </template>
                    <template #step-content-1>
                        <section class="tab-content">
                            <va-input
                                v-model="columnsFilter"
                                placeholder="Filter..."
                                class="filter-input"
                            />
                            <va-data-table class="columns-table" sticky-header virtual-scroller v-model="selectedColumns" :items="aggregationColumnsData" :columns="aggregationColumns" selectable select-mode="multiple" :loading="aggregationColumnsDataLoading" :filter="columnsFilter">
                                <template #cell(role)="data">
                                    <va-select
                                        class="role-selector"
                                        v-model="aggregationColumnsData[data.rowIndex].role"
                                        :options="[ 'group by', 'aggregate' ]"
                                        prevent-overflow
                                    />
                                </template>
                                <template #cell(aggregate_function)="data">
                                    <va-input
                                        :disabled="aggregationColumnsData[data.rowIndex].role !== 'aggregate'"
                                        v-model="aggregationColumnsData[data.rowIndex].aggregate_function"
                                    />
                                </template>
                            </va-data-table>
                        </section>
                    </template>
                    <template #step-content-2>
                        <section class="tab-content">
                            <div class="table-data-inputs-wrapper">
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
                    </template>
                </va-stepper>
            </section>
        </template>
        <template #footer>
            <div class="wizzard-footer">
                <section class="perfomance-section" v-if="activeStep === 1">
                    <div class="perfomance-stats">
                        <h3>Perfomance</h3>
                        <div class="rows-info">
                            <p>Rows count:</p><span class="rows-count-number">{{ perfomanceStats.rowsCount || "N/A" }}</span>
                        </div>
                        <div class="rows-info">
                            <p>Time passed:</p><span class="rows-count-number">{{ perfomanceStats.time ? `${perfomanceStats.time}s` : "N/A" }}</span>
                        </div>
                    </div>
                    <div class="perfomance-controll-buttons">
                        <va-button @click="startPerfomanceAnalitic" :disabled="isAnaliticStarted">Start
                            Analytics</va-button>
                        <va-button @click="stopPerfomanceAnalitic" :disabled="!isAnaliticStarted"
                            preset="primary">Stop</va-button>
                    </div>
                </section>
                <div class="controll-buttons">
                    <va-button @click="prevStep()" :disabled="activeStep === 0">Previous</va-button>
                    <va-button v-if="activeStep !== steps.length - 1" @click="nextStep()"
                        :disabled="!isTableDataReadyToSave">Next</va-button>
                    <va-button v-else @click="onSave()" :disabled="!isReadyToSave"
                        :loading="isRequestInProcess">Save</va-button>
                </div>
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
}

.columns-table {
    min-height: 10rem;
    flex-grow: 1;
}

.modal-content {
//    padding: 1rem;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.tab-content {
    width: 100%;
    min-height: 50vh;
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
    margin-bottom: 1rem;
    padding: 1rem;
    border-radius: 0.5rem;
    background-color: #eeeeee;
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: flex-end;

    .rows-info {
        display: flex;
        gap: 1rem;

        .rows-count-number {
            color: var(--va-info);
            width: 100px;
        }
    }

    .perfomance-stats {
        gap: 0.25rem;
    }

    .perfomance-controll-buttons {
        display: flex;
        gap: 1rem;
    }
}

:deep(.role-selector) {
    max-width: 7.5rem;
}

.wizzard-footer {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
}

.controll-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    flex-grow: 1;
    padding: 0 0 1rem;
}

.filter-input {
    flex-grow: 0;
}
</style>