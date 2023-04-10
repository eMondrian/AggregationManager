<script setup>
import { computed } from 'vue';
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { ROUTES } from '@/router/routes.js'

const route = useRoute();

const link = computed(
  () => route.path === ROUTES.aggregations.path
  ? { path: ROUTES.processes.path, text: 'Go to process' }
  : { path: ROUTES.aggregations.path, text: 'Go to aggregation' }
)
</script>

<template>
  <header>
    <h1>Aggregation Manager</h1>
    <nav>
      <RouterLink class="va-link" :to="link.path">{{ link.text }}</RouterLink>
    </nav>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
nav {
  display: flex;
  gap: 1rem;
}
</style>
