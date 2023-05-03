<script setup>
import { computed, ref, onMounted } from 'vue';
import * as monaco from 'monaco-editor'
import { usePromisifiedModal } from '@/composables'

const { isOpened, run, close } = usePromisifiedModal({ defaultIsOpened: true });

const initialState = {
    tabs: [
        'Properties',
        'Query',
        'Schedule',
    ],
    activeTab: 'Query',
    propertiesData: {
        title: '',
        tableName: '',
        otherProps: '',
    }
}

const tabs = ref([ ...initialState.tabs])
const activeTab = ref(initialState.activeTab)
const propertiesData = ref({ ...initialState.propertiesData })

const editor = ref(null)

onMounted(() => {
  monaco.editor.create(editor.value, {
    value: `// Type source code in your language here...\n`,
    language: 'sql',
    automaticLayout: true,
  })
})

const isReadyToSave = computed(() => Object.values(propertiesData.value).every((value) => value !== ''))

const resetState = () => {
    activeTab.value = initialState.activeTab
    propertiesData.value = { ...initialState.propertiesData }
}

const onSave = async () => {
    console.log({ ...propertiesData.value })
    resetState()
    close()
}

const onCancel = () => {
    close()
    resetState()
}

defineExpose({ run })
</script>

<template>
    <va-modal :modelValue="isOpened" size="large" noPadding hide-default-actions class="custom-large-modal">
        <template #header>
            <section class="modal-header">
                <h2 class="modal-title">
                    Create Aggregation
                </h2>
            </section>
        </template>
        <template #default>
            <section class="modal-content">
                <va-tabs v-model="activeTab" grow class="custom-tabs">
                    <template #tabs>
                        <va-tab v-for="title in tabs" :key="title" :name="title">
                            {{ title }}
                        </va-tab>
                    </template>
                    <template #default>
                        <section v-if="activeTab===tabs[0]" class="tab-content">
                            <div class="properties-inputs-wrapper">
                                <va-input v-model="propertiesData.title" placeholder="Title"/>
                                <va-input v-model="propertiesData.tableName" placeholder="Table name"/>
                                <va-input v-model="propertiesData.otherProps" placeholder="Other properties"/>
                            </div>
                        </section>
                        <section v-if="activeTab===tabs[1]" class="tab-content">
                            <div class="query-editor" ref="editor"></div>
                        </section>
                        <section v-if="activeTab===tabs[2]" class="tab-content">
                            <div class="properties-inputs-wrapper">
                                <va-input v-model="propertiesData.title" placeholder="Some"/>
                                <va-input v-model="propertiesData.tableName" placeholder="Timers"/>
                                <va-input v-model="propertiesData.otherProps" placeholder="Here"/>
                            </div>
                        </section>
                    </template>
                </va-tabs>
            </section>
        </template>
        <template #footer>
            <div class="controll-buttons">
                <va-button preset="secondary" @click="onCancel">
                    Cancel
                </va-button>
                <va-button @click="onSave" :disabled="!isReadyToSave">
                    Save
                </va-button>
            </div>
        </template>
    </va-modal>
</template>

<style lang="scss">
.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-content {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.tab-content {
    width: 100%;
    min-height: 400px;
    margin-top: 1rem;
    padding: 1rem;
}

.properties-inputs-wrapper {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.query-editor {
    width: 100%;
    height: 350px;
}

// To enable full with modal
.custom-large-modal {
    .va-modal__container {
        width: 100%;
    }

    .va-modal--size-large {
        margin: 2rem auto;
    }
}

// To enable full with tabs
.custom-tabs {
    display: flex;
    flex-direction: column;

    .va-tabs__wrapper {
        width: 100%;
    }

    .va-tabs__content {
        width: 100%;
    }
}
</style>