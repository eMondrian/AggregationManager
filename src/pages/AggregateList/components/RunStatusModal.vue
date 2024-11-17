<script setup>
import { ref } from 'vue';
import { getRunStatus, setRunStatus } from '@/api'
import { usePromisifiedModal, useErrorHandler } from '@/composables'

const status = ref(null)
const loading = ref(false);

const defaultAggregationData = {
    id: null,
    name: null
}

let aggregationData = ref({...defaultAggregationData});

const { handleError } = useErrorHandler();

const getStatus = async () => {
    try {
        loading.value = true;
        const statusReq = await getRunStatus(aggregationData.value.id);

        status.value = statusReq.state;
    } catch (e) {
        status.value = "Error getting status";
        handleError(e);
    } finally {
        loading.value = false;
    }
}

const resetState = () => {
  status.value = null;
  aggregationData.value = {...defaultAggregationData};
}

const { isOpened, run, close } = usePromisifiedModal({
    opened: async (data) => {
        aggregationData.value = data;
        await getStatus();
    },
    resetFn: resetState,
});

const setState = async (newState) => {
    try {
        loading.value = true;
        const statusReq = await setRunStatus(aggregationData.value.id, newState);

        // status.value = statusReq.state;
    } catch (e) {
        handleError(e);
    } finally {
        loading.value = false;
        await getStatus();
    }
}

const onClose = () => {
    close()
}

defineExpose({ run })
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
                  <div class="info-container">
                    <div>
                        <b>Aggregation id: </b>
                        {{ aggregationData.id }}
                    </div>
                    <div>
                        <b>Aggregation name: </b>
                        {{ aggregationData.name }}
                    </div>
                    <div>
                        <b>Current status: </b>
                        {{ status }}
                    </div>
                  </div>

                  <div class="buttons-container">
                    <va-button @click="getStatus" preset="plain">Refresh</va-button>

                    <div class="control-buttons">
                        <va-button :disabled="loading" @click="setState('RUNNING')">Run</va-button>
                        <va-button :disabled="loading" @click="setState('DISABLED')">Disable</va-button>
                        <va-button :disabled="loading" @click="setState('RUN_ONCE')">Run once</va-button>
                        <va-button :disabled="loading" @click="setState('STOPPED')">Stop</va-button>
                    </div>
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
    flex-direction: column;
    justify-content: space-between;
    gap: 1rem;
}

.info-container {
    display: flex;
    flex-direction: column;
    align-items: baseline;
    gap: 0.5rem;
}

.buttons-container {
    display: flex;
    justify-content: space-between;
    align-items: end;
}

.control-buttons {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
}
</style>