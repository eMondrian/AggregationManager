<script setup>
import { ref, computed } from 'vue';
import isEmpty from 'lodash/isEmpty';
import { getProcesses } from '@/api'
import { usePromisifiedModal, useErrorHandler } from '@/composables'

const nameInput = ref(null)
const nifiProcessSelect = ref(null)

const name = ref('')
const nifiProcess = ref({})
const isRequestInProcess = ref(false)

const processesList = ref([]);
const processesListLoading = ref(false);

const { handleError } = useErrorHandler();

const { isOpened, run, close } = usePromisifiedModal({ opened: async () => {
    try {
        processesListLoading.value = true;
        const processes = await getProcesses();

        processesList.value = processes.map((e) => {
            return {
                name: e.name,
                value: e.id
            }
        })
    } catch (e) {
        handleError(e);
    } finally {
        processesListLoading.value = false;
    }
}});

const isModalFilled = computed(() => !isEmpty(name.value) && !isEmpty(nifiProcess.value))

const resetState = () => {
    name.value = ''
    nifiProcess.value = {}
}

const onSave = async () => {
    close({ name: name.value, process: nifiProcess.value })
}

const onClose = () => {
    close()
    resetState()
}

defineExpose({ run, resetState })
</script>

<template>
    <va-modal :modelValue="isOpened" noPadding no-outside-dismiss hide-default-actions class="full-size-modal">
        <template #header>
            <section class="modal-header">
                <h2>
                    Create from NIFI process
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
                <va-input ref="nameInput" v-model="name" label="Name" />
                <va-select
                    ref="nifiProcessSelect" 
                    v-model="nifiProcess" 
                    label="NIFI process" 
                    text-by="name"
                    value-by="value"
                    :loading="processesListLoading"
                    :options="processesList"
                    prevent-overflow
                />
            </section>
        </template>
        <template #footer>
            <div class="controll-buttons">
                <va-button :loading="isRequestInProcess" :disabled="!isModalFilled" @click="onSave">
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
}

.modal-content {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.controll-buttons {
    padding: 1rem 2rem;
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
}
</style>