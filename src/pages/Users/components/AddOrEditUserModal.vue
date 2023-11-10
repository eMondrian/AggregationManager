<script setup>
import { ref, computed } from 'vue';
import cloneDeep from 'lodash/cloneDeep';
import { usePromisifiedModal } from '@/composables'

const initialState = {
    id: '',
    user_name: '',
    is_admin: false,
    is_power_user: false,
}

const userData = ref(cloneDeep(initialState))

const isEdit = computed(() => !!userData.value.id);

const resetState = () => {
    userData.value = cloneDeep(initialState)
}

const { isOpened, run, close } = usePromisifiedModal({
    opened: async (data) => {
        if (data) {
            userData.value = data
        }
    },
    resetFn: resetState,
});

const onSave = async () => {
    close({
        ...userData.value,
    })
}

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
                    {{ isEdit ? 'Edit' : 'Add' }} User
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
                <div v-if="isEdit" class="info-label-wrapper">
                    <span class="info-label">User ID: </span><span>{{ userData.id }}</span>
                </div>
                <va-input v-model="userData.user_name" label="User name" :disabled="isEdit" />
                <va-checkbox
                    v-model="userData.is_admin"
                    label="Is Admin"
                />
                <va-checkbox
                    v-model="userData.is_power_user"
                    label="Is Power User"
                />
            </section>
        </template>
        <template #footer>
            <div class="controll-buttons">
                <va-button @click="onSave()" :disabled="!userData.user_name">
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
    align-items: center;
}

.modal-content {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.controll-buttons {
    padding: 1.5rem;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
}

.info-label-wrapper {
    display: flex;
    gap: 1rem;
}

.info-label {
    font-weight: bold;
    color: var(--va-info);
}
</style>