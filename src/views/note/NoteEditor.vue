<template>
    <div>
        <mavon-editor ref="md"
                      v-model="content"
                      defaultOpen="preview"
                      :subfield="false"
                      @save="save"
                      @imgAdd="imgAdd"
                      @imgDel="imgDel"
                      class="mavon-editor"/>
    </div>
</template>

<script>
    export default {
        name: 'NoteEditor',

        data() {
            return {
                content: ''
            }
        },

        methods: {
            save() {
                console.log(this.$route.params.id)
            },
            imgAdd(pos, /*$file*/){
                this.$refs.md.$img2Url(pos,
                    'https://pic2.zhimg.com/80/v2-a248b8f1b73c4521eb84b694c25cb3da_720w.jpg?source=1940ef5c')
            },
            imgDel(/*map*/){
                // http
            },
        },

        mounted () {
            window.addEventListener('beforeunload', () => {
                this.save()
            })
        },

        beforeRouteEnter(to, from, next) {
            next(vm => vm.$store.commit('setLastViewNoteId', vm.$route.params.id))
        },

        beforeRouteUpdate (to, from, next) {
            this.save()
            this.$store.commit('setLastViewNoteId', to.params.id)
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