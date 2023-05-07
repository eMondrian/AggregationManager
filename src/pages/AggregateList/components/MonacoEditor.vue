<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as monaco from 'monaco-editor'

const props = defineProps({
    initialInputValue: {
        default: '// Type code here...\n',
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
    <div class="editor" ref="editorElement"></div>
</template>

<style lang="scss" scoped>
.editor {
    width: 100%;
    height: 368px;
}
</style>