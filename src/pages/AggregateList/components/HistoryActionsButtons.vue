<script setup>
import { HISTORY_ACTION_TYPES } from '@/constants/constants';
</script>

<template>
    <div class="history-action-container">
        <va-button preset="plain" color="info" title="View actions" :data-action="HISTORY_ACTION_TYPES.SEARCH">
            <template #append>
                <va-icon class="material-icons-outlined" size="large">
                    search
                </va-icon>
            </template>
    </va-button>
    
    <va-button preset="plain" color="info" title="View json" :data-action="HISTORY_ACTION_TYPES.CODE">
            <template #append>
                <va-icon class="material-icons-outlined" size="large">
                    code
                </va-icon>
            </template>
        </va-button>

        <va-button preset="plain" color="info" title="Download json" :data-action="HISTORY_ACTION_TYPES.DOWNLOAD">
            <template #append>
                <va-icon class="material-icons-outlined" size="large">
                    download
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
    gap: 5px;
}
</style>