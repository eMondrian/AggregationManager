<script setup>
import { ref } from 'vue';
import { usePromisifiedModal } from '@/composables'
import { codeToHtml } from 'shiki'

const json = ref(null);

const resetState = () => {
    json.value = null;
}

const { isOpened, run, close } = usePromisifiedModal({
    opened: async (data) => {
        if (data) {
            const jsonHtml = await codeToHtml(data, {
                lang: 'json',
                theme: 'one-light'
            })

            json.value = jsonHtml;
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
                    JSON Info
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
                <span class="json">
                    <div v-html="json" class="json-block"></div>
                </span>
            </section>
        </template>
        <template #footer>
            <div class="controll-button">
                <va-button color="primary" @click="onClose">
                    Close
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
}

:deep(.json-block) pre {
    padding: 16px;
    border-radius: 8px;
    line-height: 1.5;
}

.controll-button {
    padding: 1.5rem;
    width: 100%;
    display: flex;
    justify-content: flex-end;
}

.json {
    width: 100%;
    max-height: 400px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: hidden;
}

.json-block {
    height: 100%;
    width: 100%;
    overflow: auto;
}
</style>