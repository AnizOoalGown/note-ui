import {updateNote} from "@/api/note";

const note = {
    state: {
        content: '',
        originalContent: ''
    },

    mutations: {
        setContent: (state, content) => {
            state.content = content
        },
        setOriginalContent: (state, originalContent) => {
            state.originalContent = originalContent
        }
    },

    actions: {
        saveNote({state}, noteId) {
            return new Promise(resolve => {
                if (state.content === state.originalContent) {
                    resolve({changed: false})
                    return
                }
                updateNote({
                    id: noteId,
                    content: state.content
                }).then(() => {
                    resolve({changed: true})
                }).catch(err => console.log(err))
            })
        }
    }
}

export default note