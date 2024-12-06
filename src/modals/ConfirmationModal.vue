<script setup>
import { ref } from 'vue';
import { usePromisifiedModal } from '@/composables'

const defaulModalData = {
    message: null,
    id: null,
    name: null
}

let modalData = ref({...defaulModalData});

const resetState = () => {
    modalData.value = {...defaulModalData};
}

const { isOpened, run, close } = usePromisifiedModal({
    opened: (data) => {
        modalData.value = data;
    },
    resetFn: resetState,
});

const onSave = async () => {
    close({ confirmed: true })
}

const onClose = () => {
    close({ confirmed: false })
}

defineExpose({ run })
</script>

<template>
    <va-modal :modelValue="isOpened" noPadding no-outside-dismiss hide-default-actions class="full-size-modal">
        <template #header>
            <section class="modal-header">
                <h2>
                    Confirm
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
                <div class="info-container">
                    <div>
                        <b>Aggregation id: </b>
                        {{ modalData.id }}
                    </div>
                    <div>
                        <b>Aggregation name: </b>
                        {{ modalData.name }}
                    </div>
                </div>

                <div class="message-container">
                    {{ modalData.message }}
                </div>
            </section>
        </template>
        <template #footer>
            <div class="controll-buttons">
                <va-button color="primary" @click="onClose">
                    Cancel
                </va-button>
                <va-button color="danger" @click="onSave">
                    Remove
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
    margin-bottom: -1rem;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.info-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.message-container {
    font-size: 1.2rem;
    font-weight: 700;
    text-align: center;
}

.controll-buttons {
    padding: 1rem 2rem;
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
}
</style>