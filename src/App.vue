<script setup>
import { ref, computed } from 'vue';
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { ROUTES } from '@/router/routes.js'
import ErrorModal from '@/modals/ErrorModal.vue';
import { useErrorHandler } from './composables';
import { KeycloakService } from '@/authorization/KeycloakService'

const errorModal = ref(null)

const route = useRoute();

const userName = KeycloakService.GetUserName()

const navItems = [
  { path: ROUTES.home.path, text: 'Aggregation' },
  { path: ROUTES.processes.path, text: 'Events' },
  { path: ROUTES.settings.path, text: 'Settings' },
]

const acitveNavItem = computed(() => navItems.find((item) => item.path === route.path))

const { errorList, removeError } = useErrorHandler();
const closeError = (uid) => {
  removeError(uid);
}

const onOpenDetailsClick = async (error) => {
  removeError(error.uid);
  await errorModal.value.run({ error })
}

const onLogoutClick = () => {
  KeycloakService.CallLogOut()
}
</script>

<template>
  <va-navbar color="primary" class="app-navbar">
    <template #left>
      <va-navbar-item>
        Aggregation Manager
      </va-navbar-item>
    </template>
    <template #right>
      <va-navbar-item>
        <ul class="app-tabs">
          <li
            v-for="item in navItems"
            :class = "{
              'app-tabs-item': true,
              'active-tab': acitveNavItem === item
            }"
          >
            <RouterLink
              :to="item.path"
              class="app-link"
            >
              {{ item.text }}
            </RouterLink>
          </li>
        </ul>
      </va-navbar-item>
      <va-navbar-item>
        <p class="username">
          {{ userName }}
        </p>
        <va-button @click="onLogoutClick()">
          Logout
        </va-button>
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
        border="top"
        class="app-alert"
      >
        <div class="error-container">
          <p class="error-title">{{ error.name }}</p>
          <p class="error-content">{{ error.message }}</p>
          <va-button
              @click="onOpenDetailsClick(error)"
              preset="plain"
              color="danger"
            >
              Open details
          </va-button>
        </div>
      </va-alert>
    </div>
  </main>

  <ErrorModal ref="errorModal" />
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

.app-tabs {
  background: inherit;
  display: flex;
}

.app-tabs-item {
  &.active-tab {
    background-color: #156cc1;
    border-bottom: 6px solid #60bafa;
  }

  &:hover {
    background-color: var(--va-info);
  }
}

.app-link {
  padding: 0 1rem;
  height: 3.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-inverted);
}

.app-navbar {
  padding-top: 0;
  padding-bottom: 0;
}

.username {
  padding: 1rem;
  border-radius: 30%;
  background-color: #3795d9;
}

.alerts-section {
  max-height: 40em;
  width: 100%;
  bottom: 20px;
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: end;
  z-index: 2000;
  overflow: scroll;

  &::-webkit-scrollbar {
    display: none;
  }
}

.app-alert {
  width: fit-content;
  margin: 1rem;
  margin-right: 5%;
  background-color: #fdeae7 !important;
  color: "#940909";
}

.error-container {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.error-title {
  color: var(--va-danger);
  font-weight: bold;
}

.error-content {
  max-width: 30rem;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* Number of lines to show */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

<style lang="scss">
h2 {
  color: var(--va-primary)
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

  .va-modal__inner .va-modal__message {
    overflow: hidden;
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

// Global class for spinned icons
.app-spinned-icon {
	animation: spin 2s linear infinite;
}

@keyframes spin {
	0%{ -webkit-transform: rotate(0deg); transform: rotate(0deg);}
	100%{ -webkit-transform: rotate(360deg); transform: rotate(360deg);}
}
</style>
