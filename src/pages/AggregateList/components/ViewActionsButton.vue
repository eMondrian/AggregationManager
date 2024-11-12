<script setup>
const viewActions = () => console.log('viewActions');
</script>

<template>
    <div class="history-action-container">
        <va-button preset="plain" color="info" title="View actions" @click="viewActions">
            <template #append>
                <va-icon class="material-icons-outlined" size="large">
                    search
                </va-icon>
            </template>
    </va-button>
    </div>
</template>

<style>
.history-action-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>