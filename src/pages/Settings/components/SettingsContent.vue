<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'vuestic-ui'
import { getSettings, getTemplates, updateSettings } from '@/api'
import InputWithOptions from '@/components/InputWithOptions/InputWithOptions.vue'

const initialState = {
    defaultTemplate: {
        name: '',
        id: null,
    }
}
const templateOptions = ref([]);
const settings = ref(initialState)
const isLoading = ref(false)

const { init } = useToast()

const fetchSettings = async () => {
    isLoading.value = true
    try {
        const data = await getSettings();

        settings.value.defaultTemplate.name = data.default_template_name;
        settings.value.defaultTemplate.id = data.default_template_id;

        const availableTemplates = await getTemplates();
        templateOptions.value = [...availableTemplates]
    }
    finally {
        isLoading.value = false
    }
}

onMounted(() => {
    fetchSettings()
})

const onSaveButtonClick = async () => {
    try {
        isLoading.value = true

        await updateSettings({
            default_template_id: settings.value.defaultTemplate.id
        });

        init({ message: 'Data was successfully saved', color: 'success', duration: 3500 })
    }
    finally {
        isLoading.value = false
    }
}
</script>

<template>
  <section class="control-panel">
    <h2>Settings</h2>
    <div class="buttons-container">
        <va-button @click="onSaveButtonClick" :disabled="isLoading" class="save-button" size="medium" :loading="isLoading">
            Save
        </va-button>
    </div>
  </section>
  <section class="form-data">
    <InputWithOptions
        v-model="settings.defaultTemplate.id"
        label="Default template"
        :options="templateOptions"
        optionsTextBy="name"
        optionsValueBy="id"
    />
  </section>
</template>

<style lang="scss" scoped>
.control-panel {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.form-data {
    display: flex;
    flex-direction: column;
}

.buttons-container {
    display: flex;
    gap: 1rem;
}

.save-button {
    min-width: 6rem;
}
</style>