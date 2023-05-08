<script setup>
import { ref, computed } from 'vue';
import isEmpty from 'lodash/isEmpty';
import { createFromNifiProcess } from '@/api'
import { usePromisifiedModal } from '@/composables'

const nameInput = ref(null)
const nifiProcessSelect = ref(null)

const name = ref('')
const nifiProcess = ref({})
const isRequestInProcess = ref(false)

const { isOpened, run, close } = usePromisifiedModal();

const isModalFilled = computed(() => !isEmpty(name.value) && !isEmpty(nifiProcess.value))

const mockedNifiProcessOptions = ref([
    {
        text: 'Option 1',
        value: 'option-1'
    },
    {
        text: 'Option 2',
        value: 'option-2'
    }
])

const resetState = () => {
    name.value = ''
    nifiProcess.value = {}
}

const onSave = async () => {
    try {
        isRequestInProcess.value = true

        await createFromNifiProcess({ name: name.value, process: nifiProcess.value })
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

defineExpose({ run })
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
                <va-select ref="nifiProcessSelect" v-model="nifiProcess" label="NIFI process" text-by="text"
                    :options="mockedNifiProcessOptions" class="select-nifi-process" />
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