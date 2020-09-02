const getters = {
    userId: state => state.user.id,
    username: state => state.user.username,
    content: state => state.note.content,
    originalContent: state => state.note.originalContent
}

export default getters
