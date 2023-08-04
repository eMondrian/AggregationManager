<script setup>
import { ref } from 'vue';
import { isEmpty } from 'lodash';

const emit = defineEmits(['update:modelValue'])

const { options, modelValue } = defineProps({
  options: {
    type: Array,
    default: [],
  },
  modelValue: {
    type: String,
    default: '',
  }
})

const isFocused = ref(false)
const inputValue = ref(modelValue)

const onFocus = () => {
    isFocused.value = true
}

const onOptionClick = (option) => {
    inputValue.value = option
    emit('update:modelValue', option)
    isFocused.value = false
}

const onModelValueChange = (value) => {
    inputValue.value = value
    emit('update:modelValue', value)
}

const clickOutside = (event) => {
    isFocused.value = false
}
</script>

<template>
    <div class="input-wrapper">
        <va-dropdown
            v-model="isFocused"
            trigger="none"
            teleport="body"
            keepAnchorWidth
            @clickOutside="clickOutside(event)"
        >
            <template #anchor>
                <div>
                    <va-input
                        v-bind="$attrs"
                        class="inner-input"
                        :modelValue="inputValue"
                        @update:modelValue="onModelValueChange"
                        @focus="onFocus"
                        @keypress.enter="isFocused=false"
                    />
                </div>
            </template>
            <ul v-if="(isEmpty(options) === false)" class="inner-options">
                <li
                    v-for="option in options"
                    class="option"
                    :key="option"
                    @click="onOptionClick(option)"
                >
                    {{ option }}
                </li>
            </ul>
        </va-dropdown>
    </div>
</template>

<style lang="scss" scoped>
.input-wrapper {
    height: 100%;
}

.inner-input {
    width: 100%;
}

.inner-options {
    max-height: 12.5rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    font-family: var(--va-font-family);
    background: var(--va-select-dropdown-background);
    overflow: auto;
    scrollbar-color: var(--va-background-element) transparent;
    scrollbar-width: thin;
    z-index: 1000;
}

.option {
    padding: 0.375rem 0.75rem;
    min-height: 2.25rem;
    display: flex;
    align-items: center;
    word-break: break-word;
    cursor: pointer;

    &:hover {
        color: inherit;
        background-color: rgba(21, 78, 193, 0.2);
    }
}
</style>