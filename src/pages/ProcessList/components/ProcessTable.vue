<script setup>
import { generateTableData } from '@/helpers/generateMocks'

const onCreateButtonClick = () => {
    console.log('onCreateButtonClick')
}

const items = generateTableData([
    'name',
    'aggregation',
    'state',
])

const columns = [
    { key: "name", sortable: true },
    { key: "aggregation", sortable: true },
    { key: "state", sortable: true },
];
</script>

<template>
    <section class="control-panel">
        <h2>List of processes</h2>
        <div class="buttons-container">
            <va-button @click="onCreateButtonClick" title="Create" preset="plain">
                <template #append>
                    <va-icon size="large" class="material-icons-outlined">
                        add_box
                    </va-icon>
                </template>
            </va-button>
        </div>
    </section>
    <va-data-table class="app-table" :items="items" :columns="columns">
    </va-data-table>
</template>

<style lang="scss" scoped>
.control-panel {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.buttons-container {
    display: flex;
    gap: 1rem;
}
</style>