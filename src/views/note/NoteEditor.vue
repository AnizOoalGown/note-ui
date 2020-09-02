<template>
    <div>
        <mavon-editor ref="md"
                      id="md"
                      v-model="content"
                      v-loading="loading"
                      defaultOpen="preview"
                      :subfield="false"
                      @save="save(noteId, true)"
                      @imgAdd="imgAdd"
                      @imgDel="imgDel"
                      class="mavon-editor"/>
    </div>
</template>

<script>
    import {getNoteById, updateNote} from "@/api/note";
    import {createImage, deleteImage} from "@/api/image";
    import {dataURLtoFile} from "@/utils/imageUtils";

    export default {
        name: 'NoteEditor',

        data() {
            return {
                loading: false
            }
        },

        methods: {
            save(noteId, feedback) {
                return new Promise(resolve => {
                    if (this.content === this.originalContent && !feedback) {
                        resolve()
                        return
                    }
                    this.loading = true
                    updateNote({
                        id: noteId,
                        content: this.content
                    }).then(() => {
                        if (feedback) this.$message.success('手动保存成功')
                        resolve()
                    }).catch(err => console.log(err))
                        .finally(() => this.loading = false)
                })
            },
            imgAdd(pos, file) {
                this.loading = true
                createImage(this.noteId, file).then(res => {
                    const no = res.data['no']
                    this.$refs.md.$img2Url(pos, no)
                    this.$refs.md.$imgUpdateByUrl(no, file.miniurl)
                }).catch(err => console.log(err))
                .finally(() => this.loading = false)
            },
            imgDel(arr) {
                this.loading = true
                const no = arr[0]
                deleteImage(this.noteId, no).finally(() => this.loading = false)
            },
            viewNote(noteId) {
                this.loading = true
                this.content = ''
                this.originalContent = ''
                getNoteById(noteId).then(res => {
                    this.content = res.data.content
                    this.originalContent = res.data.content
                    this.$refs.md.$refs.toolbar_left.img_file = this.$refs.md.$refs.toolbar_left.img_file.slice(0, 1)
                    res.data.images.forEach(image => {
                        const url = 'data:image/png;base64,' + image['data']
                        this.$refs.md.$imgUpdateByUrl(image['no'], url)
                        const file = dataURLtoFile(url, image['no'])
                        this.$refs.md.$refs.toolbar_left.$imgAddByFilename(image['no'], file)
                    })
                    this.loading = false
                }).catch(err => console.log(err))
            }
        },

        mounted () {
            window.addEventListener('beforeunload', () => {
                this.save(this.noteId)
            })
        },

        computed: {
            noteId() {
                return this.$route.params.id
            },
            content: {
                get() {
                    return this.$store.getters.content
                },
                set(newVal) {
                    this.$store.commit('setContent', newVal)
                }
            },
            originalContent: {
                get() {
                    return this.$store.getters.originalContent
                },
                set(newVal) {
                    this.$store.commit('setOriginalContent', newVal)
                }
            }
        },

        watch: {
            noteId: {
                handler: function (val, oldVal) {
                    if (oldVal) {
                        this.save(oldVal).then(() => this.viewNote(val))
                    }
                    else {
                        this.viewNote(val)
                    }
                },
                immediate: true
            }
        },

        beforeRouteLeave(to, from, next) {
            this.save(this.noteId)
            next()
        }
    }
</script>

<style scoped>
    .mavon-editor {
        height: calc(100vh - 55px);
    }
</style>