<script setup>
const { params } = defineProps();
const { data: rowData, onCalculate, onEdit, onDelete, reset } = params;

const handleCalculate = () => onCalculate(rowData);
const handleEdit = () => onEdit(rowData);
const handleDelete = () => onDelete(rowData);
const handleReset = () => reset(rowData);
</script>

<template>
    <div class="table-action-buttons">
        <va-button preset="plain" color="info" title="Run calculations" @click="handleCalculate">
            <template #append>
                <va-icon class="material-icons-outlined" size="large">
                    playlist_play
                </va-icon>
            </template>
        </va-button>
        <va-button preset="plain" color="info" title="Edit" @click="handleEdit">
            <template #append>
                <va-icon class="material-icons-outlined" size="large">
                    edit
                </va-icon>
            </template>
        </va-button>
        <va-button preset="plain" color="info" title="Delete" @click="handleDelete">
            <template #append>
                <va-icon class="material-icons-outlined" size="large">
                    delete
                </va-icon>
            </template>
        </va-button>
        <va-button preset="plain" color="info" title="Reset" @click="handleReset">
            <template #append>
                <va-icon class="material-icons-outlined" size="large">
                    restart_alt
                </va-icon>
            </template>
        </va-button>
    </div>
</template>

<style>
.table-action-buttons {
    height: 100%;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}
</style>