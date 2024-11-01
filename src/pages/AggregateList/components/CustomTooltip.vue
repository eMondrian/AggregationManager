<script setup>
const props = defineProps();
</script>

<template>
    <div class="custom-tooltip" @click="props.params.copyToClipboard(props.params.value)">
      <div class="tooltip-message">
        {{ props.params.value }}
      </div>

      <p class="clipboard-message">Click to copy to clipboard</p>
    </div>
  </template>
  
  <style>
  .custom-tooltip {
    padding: 1rem;
    width: 450px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    font-size: 1rem;
    background-color: black;
    color: white;
    border-radius: 10px;
    opacity: 0.9;
  }

  .tooltip-message {
    padding-right: 10px;
    max-height: 400px;
    overflow: auto;
  }

  .clipboard-message {
    display: flex;
    justify-content: end;
    color: rgb(119, 178, 31);
  }

  .custom-tooltip:hover {
    cursor: pointer;
  }
  </style>
  