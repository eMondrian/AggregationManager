<script setup>
import { ref } from 'vue';
import { cloneDeep } from 'lodash';
import { usePromisifiedModal } from '@/composables'

import { codeToHtml } from 'shiki'

const initialData = {
    id: '',
    user: '',
    tableName: '',
    nifiProcess: '',
    query: '',
    schedulingPeriod: '',
    schedulingStrategy: ''
}

const actionData = ref({...initialData});
const query = ref(null);

const resetState = () => {
    actionData.value = cloneDeep(initialData)
}

const { isOpened, run, close } = usePromisifiedModal({
    opened: async (data) => {
        if (data) {
            actionData.value = data;

            const queryHtml = await codeToHtml(data.query, {
                lang: 'sql',
                theme: 'one-light'
            })

            query.value = queryHtml;
        }
    },
    resetFn: resetState,
});

const onClose = () => {
    close()
}

defineExpose({ run })
</script>

<template>
    <va-modal :modelValue="isOpened" size="large" fixed-layout noPadding hide-default-actions class="full-size-modal">
        <template #header>
            <section class="modal-header">
                <h2>
                    Aggregation info
                </h2>
            </section>
        </template>
        <template #default>
            <section class="modal-content">
                <span><b>Id: </b>{{ actionData.id }}</span>
                <span><b>Name: </b>{{ actionData.aggregation_name }}</span>
                <span><b>Table name: </b>{{ actionData.table_name }}</span>
                <span><b>NIFI Process: </b>{{ actionData.start_nifi_process_id }}</span>
                <span>
                    <b>Query: </b>
                    <div v-html="query" class="query-block"></div>
                </span>
                <span><b>Schedule: </b>{{ actionData.scheduling_period }}</span>
                <span><b>Scheduling strategy: </b>{{ actionData.scheduling_strategy }}</span>
            </section>
        </template>
        <template #footer>
            <div class="controll-buttons">
                <va-button color="primary" @click="onClose">
                    Close
                </va-button>
                <va-button color="primary">
                    Restore
                </va-button>
            </div>
        </template>
    </va-modal>
</template>

<style scoped>
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

.query-block {
    padding: 10px;
}

.controll-buttons {
    padding: 1.5rem;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
}
</style>