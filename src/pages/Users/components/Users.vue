<script setup>
import sortBy from 'lodash/sortBy'
import { ref, onMounted } from 'vue'
import { useToast } from 'vuestic-ui'
import { getUsersTableData, addUser, getUser, updateUser, removeUser } from '@/api'
import ConfirmationComponentModal from '@/modals/ConfirmationComponentModal.vue'
import LoadingIndicator from '@/modals/LoadingIndicator.vue'
import { useErrorHandler } from '@/composables'
import AddOrEditUserModal from './AddOrEditUserModal.vue'
import DeleteConfirmationTemplate from './DeleteConfirmationTemplate.vue'

const addOrEditUserModal = ref(null)
const confirmationComponentModal = ref(null)
const tableData = ref([])
const isLoading = ref(false)
const apiCallRunning = ref(false);
const filterValue = ref('')

const { init } = useToast()
const { handleError } = useErrorHandler();

const fetchTableData = async () => {
    try {
        isLoading.value = true
        const data = await getUsersTableData()
        tableData.value = sortBy(data, ({ user_name }) => user_name)
    } catch (e) {
        handleError(e);
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    fetchTableData()
})

const onUpdateButtonClick = () => {
    fetchTableData()
}

const onCreateButtonClick = async () => {
    const userDesc = await addOrEditUserModal.value.run();
    
    if (userDesc) {
        try {
            apiCallRunning.value = true;
            await addUser(userDesc);
            await fetchTableData()
            init({ message: 'User was successfully added', color: 'success', duration: 3500 })
        } catch (e) {
            handleError(e);
            apiCallRunning.value = false;
            await onCreateButtonClick()
        } finally {
            apiCallRunning.value = false;
        }
    }
}

const onEdit = async (item) => {
    const user = await getUser(item.id);

    const userDesc = await addOrEditUserModal.value.run(user);

    if (userDesc) {
        try {
            apiCallRunning.value = true;
            await updateUser(userDesc);
            await fetchTableData()
            init({ message: 'User was successfully edited', color: 'success', duration: 3500 })
        } catch (e) {
            handleError(e);
            apiCallRunning.value = false;
            await onCreateButtonClick()
        } finally {
            apiCallRunning.value = false;
        }
    }
}

const onDelete = async (item) => {
    const { confirmed } = await confirmationComponentModal.value.run({ component: DeleteConfirmationTemplate, data: item })
    if (!confirmed) {
        return;
    }

    try {
        apiCallRunning.value = true;
        await removeUser(item.id);
        await fetchTableData();
        init({ message: 'User was successfully removed', color: 'success', duration: 3500 })
    } catch (e) {
        handleError(e);
    } finally {
        apiCallRunning.value = false;
    }
};

const columns = [
    { key: 'user_name', sortable: true },
    { key: 'is_admin', sortable: true },
    { key: 'is_power_user', sortable: true },
    { key: 'actions', width: 80 },
];
</script>

<template>
    <section class="control-panel">
        <h2>Users</h2>
        <div class="buttons-container">
            <va-button @click="onCreateButtonClick" preset="plain" title="Create">
                <template #append>
                    <va-icon size="large" class="material-icons-outlined">
                        add_box
                    </va-icon>
                </template>
            </va-button>
            <va-button @click="onUpdateButtonClick" preset="plain" :disabled="isLoading" title="Update table Data">
                <template #append>
                    <va-icon size="large"
                        :class = "{
                            'material-icons-outlined': true,
                            'app-spinned-icon': isLoading
                        }"
                    >
                        change_circle
                    </va-icon>
                </template>
            </va-button>
        </div>
    </section>
    <va-input
        v-model="filterValue"
        label="filter"
        placeholder="contains..."
        class="filter-input"
        clearable
    />
    <va-data-table
        :loading="isLoading"
        class="app-table"
        :items="tableData"
        :columns="columns"
        :filter="filterValue"
        sticky-header
        :scroll-bottom-margin="40"
    >
        <template #cell(is_admin)="data">
            <va-icon class="material-icons-outlined">
                {{ data.rowData.is_admin === 't' ? 'done' : 'block' }}
            </va-icon>
        </template>
        <template #cell(is_power_user)="data">
            <va-icon class="material-icons-outlined">
                {{ data.rowData.is_power_user === 't' ? 'done' : 'block' }}
            </va-icon>
        </template>
        <template #cell(actions)="{ rowIndex }">
            <div class="table-action-buttons">
                <va-button preset="plain" color="info" title="Edit" @click="onEdit(tableData[rowIndex])">
                    <template #append>
                        <va-icon class="material-icons-outlined">
                            edit
                        </va-icon>
                    </template>
                </va-button>
                <va-button preset="plain" color="info" title="Delete" @click="onDelete(tableData[rowIndex])">
                    <template #append>
                        <va-icon class="material-icons-outlined">
                            delete
                        </va-icon>
                    </template>
                </va-button>
            </div>
        </template>
    </va-data-table>

    <teleport to="body">
        <add-or-edit-user-modal ref="addOrEditUserModal"/>
        <loading-indicator :isOpened="apiCallRunning" />
        <confirmation-component-modal ref="confirmationComponentModal"  />
    </teleport>
</template>

<style lang="scss" scoped>
.control-panel {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.filter-input {
    width: 25rem;
    max-width: 40%;
}

.app-table {
    width: 100%;
    height: 100%;
}

.buttons-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.table-action-buttons {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}
</style>