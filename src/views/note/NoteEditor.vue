<template>
    <div>
        <mavon-editor ref="md"
                      v-model="content"
                      v-loading="loading"
                      defaultOpen="preview"
                      :subfield="false"
                      @save="save"
                      @imgAdd="imgAdd"
                      @imgDel="imgDel"
                      class="mavon-editor"/>
    </div>
</template>

<script>
    import {getNoteById, updateNote} from "@/api/note";

    export default {
        name: 'NoteEditor',

        data() {
            return {
                content: '',
                images: [],
                loading: false
            }
        },

        methods: {
            save() {
                console.log('save' + this.$route.params.id)
                updateNote({
                    id: this.$route.params.id,
                    content: this.content
                }).then(res => this.$message.success(res.msg))
            },
            imgAdd(pos, file) {
                console.log(file)
                // https://pic2.zhimg.com/80/v2-a248b8f1b73c4521eb84b694c25cb3da_720w.jpg?source=1940ef5c
                const id = new Date().getTime() % 1e6 + ''
                this.$refs.md.$img2Url(pos, id)
                this.$refs.md.$imgUpdateByUrl(id, file.miniurl)
            },
            imgDel(/*map*/) {
                // http
            },
            viewNote(noteId) {
                this.loading = true
                getNoteById(noteId).then(res => {
                    this.content = res.data.note.content
                    this.images = res.data.images
                }).finally(() => this.loading = false)
            }
        },

        mounted () {
            window.addEventListener('beforeunload', () => {
                this.save()
            })
        },

        beforeRouteEnter(to, from, next) {
            next(vm => {
                vm.viewNote(vm.$route.params.id)
            })
        },

        beforeRouteUpdate (to, from, next) {
            this.save()
            this.viewNote(to.params.id)
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