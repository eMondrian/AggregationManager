<script setup>
const props = defineProps(['data'])
</script>

<template>
    <div>
        Are you sure you want to remove this user?
    </div>
    <ul class="items">
        <li class="list-item">
            <span class="label">ID:</span>
            <span>{{ props.data.id }}</span>
        </li>
        <li class="list-item">
            <span class="label">User Name:</span>
            <span>{{ props.data.user_name }}</span>
        </li>
        <li class="list-item">
            <span class="label">Is Admin:</span>
            <va-icon class="material-icons-outlined">
                {{ props.data.is_admin ? 'done' : 'block' }}
            </va-icon>
        </li>
        <li class="list-item">
            <span class="label">Is Power User:</span>
            <va-icon class="material-icons-outlined">
                {{ props.data.is_power_user ? 'done' : 'block' }}
            </va-icon>
        </li>
    </ul>
</template>

<style lang="scss" scoped>

.items {
    .list-item {
        display: flex;
    }

    .label {
        min-width: 10rem;
    }
}
</style>