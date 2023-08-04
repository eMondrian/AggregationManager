<script setup>
import { ref } from 'vue';
import { usePromisifiedModal } from '@/composables'

const initialState = {
    name: '',
    message: '',
}

const errorData = ref(initialState);
const showCopiedMessage = ref(false)

const { isOpened, run, close } = usePromisifiedModal({
    opened: ({ error }) => {
        errorData.value = error;
    }
});


const resetState = () => {
    errorData.value = {};
}

const onCopy = () => {
    const str = errorData.value.message;
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    showCopiedMessage.value = true;

    setTimeout(() => {
        showCopiedMessage.value = false;
    }, 3000);
}

const onClose = () => {
    resetState()
    close()
}

defineExpose({ run, resetState })
</script>

<template>
    <va-modal :modelValue="isOpened" noPadding no-outside-dismiss hide-default-actions class="danger-modal">
        <template #header>
            <section class="modal-header">
                <h2>
                    {{ errorData.name }}
                </h2>
                <va-button preset="plain" title="Close" @click="onClose">
                    <template #append>
                        <va-icon class="material-icons-outlined" color="danger">
                            close
                        </va-icon>
                    </template>
                </va-button>
            </section>
        </template>
        <template #default>
            <section class="modal-content">
                {{ errorData.message }}
            </section>
        </template>
        <template #footer>
            <div class="controll-buttons">
                <va-button @click="onCopy" preset="plain">
                    Copy error message
                </va-button>
            </div>
        </template>
    </va-modal>

    <teleport to="body">
        <div class="success-alert">
            <va-alert
                v-model="showCopiedMessage"
                closeable
                color="success"
                class="mb-6"
            >
                Error Message was copied to clipboard
            </va-alert>
        </div>
    </teleport>
</template>

<style lang="scss" scoped>
.modal-header {
    padding: 0.5rem 1rem 0;
    display: flex;
    align-items: center;
    justify-content: space-between;

    h2 {
        color: var(--va-danger);
    }
}

.modal-content {
    padding: 1rem;
    max-height: 50em;
    overflow: auto;
}

.controll-buttons {
    padding: 0 1rem 1rem;
    width: 100%;
    display: flex;
    justify-content: flex-end;
}
</style>

<style lang="scss">
.danger-modal {
    z-index: 1000000;

    & .va-modal__inner {
        background-color: #fdeae7;
    }

    .va-modal__overlay {
        background-color: rgba(0, 0, 0, 0.2);
    }
}
</style>