<script setup>
import { ref } from 'vue';
import { getRunStatus, setRunStatus } from '@/api'
import { usePromisifiedModal, useErrorHandler } from '@/composables'

const status = ref(null)
const loading = ref(false);
let aggregationId = null;

const { handleError } = useErrorHandler();

const getStatus = async () => {
    try {
        loading.value = true;
        const statusReq = await getRunStatus(aggregationId);

        status.value = statusReq.state;
    } catch (e) {
        status.value = "Error getting status";
        handleError(e);
    } finally {
        loading.value = false;
    }
}

const { isOpened, run, close } = usePromisifiedModal({ opened: async (id) => {
  aggregationId = id;
  await getStatus();
}});

const resetState = () => {
  status.value = null;
  aggregationId = null;
}

const onClose = () => {
    close()
    resetState()
}

const setState = async (newState) => {
    try {
        loading.value = true;
        const statusReq = await setRunStatus(aggregationId, newState);

        // status.value = statusReq.state;
    } catch (e) {
        handleError(e);
    } finally {
        loading.value = false;
        await getStatus();
    }
}
defineExpose({ run, resetState })
</script>

<template>
    <va-modal :modelValue="isOpened" noPadding no-outside-dismiss hide-default-actions class="full-size-modal">
        <template #header>
            <section class="modal-header">
                <h2>
                    Process status
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
            <va-inner-loading :loading="loading">
              <section class="modal-content">
                  <div>
                    <div>Current status: {{ status }}</div>
                    <va-button @click="getStatus" preset="plain">Refresh</va-button>
                  </div>
                  <div class="buttons-container">
                    <va-button :disabled="loading" @click="setState('RUNNING')">Run</va-button>
                    <va-button :disabled="loading" @click="setState('DISABLED')">Disable</va-button>
                    <va-button :disabled="loading" @click="setState('RUN_ONCE')">Run once</va-button>
                    <va-button :disabled="loading" @click="setState('STOPPED')">Stop</va-button>
                  </div>
              </section>
            </va-inner-loading>
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
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
}

.controll-buttons {
    padding: 1rem 2rem;
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
}

.buttons-container {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
}
</style>