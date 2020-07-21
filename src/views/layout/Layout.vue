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
        components: {NavBar},
        mounted () {
            window.addEventListener('beforeunload', () => {
                // save lastViewNoteId
            })
        },
    }
</script>

<style scoped>

</style>