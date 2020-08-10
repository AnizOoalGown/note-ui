<template>
    <div>
        <NavBar/>
        <router-view/>
    </div>
</template>

<script>
    import NavBar from "@/views/layout/NavBar";
    export default {
        name: "Layout",
        components: {NavBar}
    }
</script>

<style scoped>

</style>