<script setup>
const { isOpened } = defineProps({
  isOpened: Boolean
})
</script>

<template>
  <va-modal :modelValue="isOpened" noPadding no-outside-dismiss hide-default-actions size="small">
    <div class="loader-container">
      <va-inner-loading loading />
    </div>
  </va-modal>
</template>

<style>
.loader-container {
  height: 50px;
  margin-top: 50px;
}
</style>