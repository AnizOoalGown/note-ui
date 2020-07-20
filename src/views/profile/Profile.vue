<template>
    <div class="profile-container">
        <UserInfo/>
    </div>
</template>

<script>
    import UserInfo from '@/components/UserInfo'
    export default {
        name: 'Profile',
        components: {UserInfo},
    }
</script>

<style scoped>
    .profile-container {
        width: 50%;
        min-width: 800px;
        margin: 0 auto;
    }
</style>