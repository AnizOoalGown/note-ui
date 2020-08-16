<template>
    <div>
        <mavon-editor ref="md"
                      id="md"
                      v-model="content"
                      v-loading="loading"
                      defaultOpen="preview"
                      :subfield="false"
                      @save="save($route.params.id)"
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
            save(noteId) {
                updateNote({
                    id: noteId,
                    content: this.content
                })
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
                    this.content = res.data.content
                    this.images = res.data.images
                }).finally(() => this.loading = false)
            }
        },

        mounted () {
            window.addEventListener('beforeunload', () => {
                this.save(this.$route.params.id)
            })
        },

        watch: {
            '$route.params.id': {
                handler: function (val, oldVal) {
                    if (oldVal) {
                        this.save(oldVal)
                    }
                    this.viewNote(val)
                },
                immediate: true
            }
        }
    }
</script>

<style scoped>
    .mavon-editor {
        height: calc(100vh - 70px);
    }
</style>