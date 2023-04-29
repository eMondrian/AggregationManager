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

const onCancel = () => {
    close()
    resetState()
}

defineExpose({ run })
</script>

<template>
    <va-modal
        :modelValue="isOpened"
        size="large"
        noPadding
        no-outside-dismiss
        hide-default-actions
    >
        <template #header>
            <h2 class="modal-header">
                Create from NIFI process
            </h2>
        </template>
        <template #default>
            <section class="modal-content">
                <va-input
                    ref="nameInput"
                    v-model="name"
                    placeholder="Name"
                />
                <va-select
                    ref="nifiProcessSelect"
                    v-model="nifiProcess"
                    placeholder="NIFI process"
                    text-by="text"
                    :options="mockedNifiProcessOptions"
                />
            </section>
        </template>
        <template #footer>
            <div class="controll-buttons">
                <va-button
                    preset="secondary"
                    @click="onCancel"
                >
                    Cancel
                </va-button>
                <va-button
                    :loading="isRequestInProcess"
                    :disabled="!isModalFilled"
                    @click="onSave"
                >
                    Save
                </va-button>
            </div>
        </template>
    </va-modal>
</template>

<style lang="scss">
.modal-header {
    padding: 1rem 2rem;
    border-bottom: 1px solid var(--va-info);
}

.modal-content {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.controll-buttons {
    padding: 1rem;
    display: flex;
    justify-content: center;
    gap: 1rem;
}
</style>