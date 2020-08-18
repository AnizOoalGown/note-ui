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
    import {createImage, deleteImage} from "@/api/image";
    import {dataURLtoFile} from "@/utils/imageUtils";

    export default {
        name: 'NoteEditor',

        data() {
            return {
                content: '',
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
                this.loading = true
                createImage(this.$route.params.id, file).then(res => {
                    const no = res.data['no']
                    this.$refs.md.$img2Url(pos, no)
                    this.$refs.md.$imgUpdateByUrl(no, file.miniurl)
                }).catch(err => console.log(err))
                .finally(() => this.loading = false)

            },
            imgDel(arr) {
                this.loading = true
                const no = arr[0]
                deleteImage(this.$route.params.id, no).finally(() => this.loading = false)
            },
            viewNote(noteId) {
                this.loading = true
                getNoteById(noteId).then(res => {
                    this.content = res.data.content
                    this.$refs.md.$refs.toolbar_left.img_file = this.$refs.md.$refs.toolbar_left.img_file.slice(0, 1)
                    res.data.images.forEach(image => {
                        const url = 'data:image/png;base64,' + image['data']
                        this.$refs.md.$imgUpdateByUrl(image['no'], url)
                        const file = dataURLtoFile(url, image['no'])
                        this.$refs.md.$refs.toolbar_left.$imgAddByFilename(image['no'], file)
                    })
                }).finally(() => this.loading = false)
            }
        },

        mounted () {
            console.log(this.$refs.md.$refs.toolbar_left.img_file)
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