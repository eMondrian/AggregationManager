<script setup>
import { ref, watch } from 'vue';
import { isEmpty } from 'lodash';

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  options: {
    type: Array,
    default: [],
  },
  modelValue: {
    type: String,
  },
  optionsTextBy: {
    type: String
  },
  optionsValueBy: {
    type: String
  },
})

const isFocused = ref(false)
const inputValue = ref(props.modelValue)


watch(() => props.modelValue, () => {
    inputValue.value = props.modelValue;
})

const onFocus = () => {
    isFocused.value = true
}

const onOptionClick = (option) => {
    if (props.optionsValueBy) {
        inputValue.value = option[props.optionsValueBy]
        emit('update:modelValue', option[props.optionsValueBy])
    } else {
        inputValue.value = option
        emit('update:modelValue', option)
    }
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
                    >
                        <template #appendInner v-if="optionsTextBy && optionsValueBy">
                            <span class="input-value-name">{{ options.find((e) => e[optionsValueBy] === inputValue)?.[optionsTextBy] }}</span>
                        </template>
                    </va-input>
                </div>
            </template>
            <ul v-if="(isEmpty(options) === false)" class="inner-options">
                <li
                    v-for="option in options"
                    class="option"
                    :key="option"
                    @click="onOptionClick(option)"
                >
                    <div :class="{
                        'selected': $props.optionsValueBy ?
                            option[$props.optionsValueBy] === inputValue :
                            option === inputValue
                    }">
                        <template v-if="$props.optionsTextBy">
                            <span>{{ option[$props.optionsValueBy] }}</span>
                            <span class="text-hint">({{ option[$props.optionsTextBy] }})</span>
                        </template>
                        <template v-else>
                            <span>{{ option }}</span>
                        </template>
                    </div>
                    <div v-if="
                        $props.optionsValueBy ?
                            option[$props.optionsValueBy] === inputValue :
                            option === inputValue
                    ">
                        <va-icon class="material-icons-outlined selected" size="16px">
                            done
                        </va-icon>
                    </div>
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
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
    border-radius: 4px;
}

.option {
    padding: 0.375rem 0.75rem;
    min-height: 2.25rem;
    display: flex;
    align-items: center;
    word-break: break-word;
    cursor: pointer;
    flex-direction: row;
    justify-content: space-between;

    &:hover {
        color: inherit;
        background-color: rgba(21, 78, 193, 0.2);
    }

    .text-hint {
        margin-left: 0.25rem;
        opacity: 0.7;
    }

    .selected {
        color: var(--va-primary);
    }
}

.input-value-name {
    white-space: nowrap;
}
</style>