const getters = {
    userId: state => state.user.id,
    username: state => state.user.name,
    lastViewNoteId: state => state.user.lastViewNoteId
}

export default getters
