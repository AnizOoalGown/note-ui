<template>
    <div>
        <mavon-editor ref="md"
                      v-model="content"
                      defaultOpen="preview"
                      :subfield="false"
                      class="mavon-editor"/>
    </div>
</template>

<script>
    export default {
        name: "NoteEditor",

        data() {
            return {
                content: '',
            }
        },

        methods: {
            save() {
                console.log(this.$route.params.id)
            }
        },

        beforeRouteUpdate (to, from, next) {
            this.save()
            next()
        },

        beforeRouteLeave (to, from, next) {
            this.save()
            next()
        }
    }
</script>

<style scoped>
    .mavon-editor {
        height: calc(100vh - 70px);
    }
</style>