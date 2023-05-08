<script setup>
import { computed } from 'vue';
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { ROUTES } from '@/router/routes.js'

const route = useRoute();

const link = computed(
  () => route.path === ROUTES.home.path
    ? { path: ROUTES.processes.path, text: 'Go to process' }
    : { path: ROUTES.home.path, text: 'Go to aggregation' }
)
</script>

<template>
  <va-navbar color="primary">
    <template #left>
      <va-navbar-item>
        Aggregation Manager
      </va-navbar-item>
    </template>
    <template #right>
      <va-navbar-item>
        <RouterLink class="app-link" :to="link.path">{{ link.text }}</RouterLink>
      </va-navbar-item>
    </template>
  </va-navbar>

  <main>
    <RouterView />
  </main>
</template>

<style lang="scss">
h2 {
  color: var(--va-primary)
}

main {
  padding: 1rem 4%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.app-link {
  color: var(--text-inverted);
}

.app-table {
  --va-data-table-thead-color: var(--va-primary);
}

// To fix mobile navbar template representation
.va-navbar {
  justify-content: space-around;
}

// To enable full with modal
.full-size-modal {
  .va-modal__container {
    width: 100%;
  }

  .va-modal__dialog {
    margin: 0 auto;
  }
}

// To fix select-dropdown background 
.va-select-dropdown__content {
  z-index: 1;
}
</style>
