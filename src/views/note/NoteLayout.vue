<template>
    <div style="position: relative">
        <NoteMenu class="sideBar"/>
        <router-view class="note-container"/>
    </div>
</template>

<script>
    import NoteMenu from "@/views/note/NoteMenu";
    export default {
        name: "NoteLayout",
        components: {NoteMenu}
    }
</script>

<style scoped>
    .sideBar {
        width: 380px;
        height: 100%;
        position: fixed;
        border-right: grey 1px solid;
    }
    .note-container {
        height: 100px;
        margin-left: 380px;
    }

</style>