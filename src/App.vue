<script setup>
import { computed } from 'vue';
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { ROUTES } from '@/router/routes.js'
import { useErrorHandler } from './composables';

const route = useRoute();

const link = computed(
  () => route.path === ROUTES.home.path
    ? { path: ROUTES.processes.path, text: 'Go to events' }
    : { path: ROUTES.home.path, text: 'Go to aggregation' }
)

const { errorList, removeError } = useErrorHandler();
const closeError = (uid) => {
  console.log('close', uid)
  removeError(uid);
}

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
    <div class="alerts-section">
      <va-alert
        v-for="error in errorList"
        :key="error.uid"
        @update:model-value="closeError(error.uid)"
        closeable
        color="danger"
        class="mb-6"
      >
        <b>{{ error.name }}:</b> <span>{{ error.message }}</span> 
      </va-alert>
    </div>
  </main>
</template>


<style lang="css" scoped>
main {
  padding: 2rem 4%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
  overflow: hidden;
}
</style>

<style lang="scss">
h2 {
  color: var(--va-primary)
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

// To enable full with tabs
.full-size-tabs {
    display: flex;
    flex-direction: column;

    .va-tabs__wrapper {
        width: 100%;
    }
    .va-tabs__content {
        width: 100%;
    }
}

// To fix select-dropdown background 
.va-select-dropdown__content {
  z-index: 1000;
}

.alerts-section {
  z-index: 2000;
  display: flex;
  flex-direction: column;
  bottom: 0;
  width: 100%;
  bottom: 20px;
}
</style>
