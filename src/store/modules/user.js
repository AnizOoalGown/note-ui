const user = {
    state: {
        id: '',
        name: 'Aniz',
        lastViewNoteId: ''
    },

    mutations: {
        setUser: (state, user) => {
            state.id = user.id
            state.name = user.name
            state.lastViewNoteId = user.lastViewNoteId
        },
        setLastViewNoteId: (state, lastViewNoteId) => {
            state.lastViewNoteId = lastViewNoteId
        }
    }
}

export default user
