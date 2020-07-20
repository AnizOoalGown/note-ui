const user = {
    state: {
        id: '',
        username: 'Aniz',
        lastViewNoteId: ''
    },

    mutations: {
        setUser: (state, user) => {
            state.id = user.id
            state.username = user.username
            state.lastViewNoteId = user.lastViewNoteId
        },
        setLastViewNoteId: (state, lastViewNoteId) => {
            state.lastViewNoteId = lastViewNoteId
        }
    }
}

export default user
