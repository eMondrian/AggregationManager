<script setup>
import { ref } from 'vue'
import { wait } from '@/helpers'

import { useToast } from 'vuestic-ui'

const saveKey = 'settings'
const initialState = {
    defaultTemplate: '',
}

const isLoading = ref(false)
const settings = ref(JSON.parse(localStorage.getItem(saveKey) || initialState))
const { init } = useToast()

const onSaveButtonClick = async () => {
    isLoading.value = true
    await wait(1000)
    localStorage.setItem(saveKey, JSON.stringify(settings.value))
    init({ message: 'Data was successfully saved', color: 'success', duration: 3500 })
    isLoading.value = false
}
</script>

<template>
  <section class="control-panel">
    <h2>Settings</h2>
    <div class="buttons-container">
        <va-button @click="onSaveButtonClick" :disabled="isLoading" class="save-button">
        <va-icon
            v-if="isLoading"
            :class = "{
                'material-icons-outlined': true,
                'app-spinned-icon': isLoading
            }"
        >
            change_circle
        </va-icon>
        <span v-else>Save</span>
    </va-button>
    </div>
  </section>
  <section class="form-data">
    <va-input
        label="default template"
        v-model="settings.defaultTemplate"
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
    height: 2.4rem;
    min-width: 6rem;
}
</style>