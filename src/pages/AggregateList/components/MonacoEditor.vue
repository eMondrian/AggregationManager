<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as monaco from 'monaco-editor'

const props = defineProps({
    initialInputValue: {
        default: '',
    },
    onUnmount: {
        default: () => { }
    }
})

const editorElement = ref(null)

let editor
const createEditor = (initialInputValue = props.initialInputValue) => {
    editor = monaco.editor.create(
        editorElement.value,
        {
            value: initialInputValue,
            language: 'sql',
            automaticLayout: true,
        }
    )
}

const getValue = () => {
    return editor.getValue()
}

onBeforeUnmount(() => {
    props.onUnmount(getValue())
})

onMounted(() => {
    createEditor()
})
</script>

<template>
    <section class="editor-wrapper">
        <p>Type code below:</p>
        <div class="editor" ref="editorElement"></div>
    </section>
</template>

<style lang="scss" scoped>
.editor-wrapper {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.editor {
    width: 100%;
    height: 25.2rem;
}
</style>