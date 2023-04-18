<script setup>
import { usePromisifiedModal } from '@/composables'

const { isOpened, run, close } = usePromisifiedModal();

const onOk = (data) => {
    console.log('onOk modal', data)
    close(data)
}

const onCancel = (data) => {
    console.log('onCancel modal', data)
    close(data)
}

defineExpose({ run })
</script>

<template>
    <va-modal
        :modelValue="isOpened"
        @ok="onOk"
        @cancel="onCancel"
    >
        Create NIFI Modal
    </va-modal>
</template>

<style lang="scss" scoped>

</style>