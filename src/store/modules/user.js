const user = {
    state: {
        id: '',
        username: 'Aniz'
    },

    mutations: {
        setUser: (state, user) => {
            state.id = user.id
            state.username = user.username
        }
    }
}

export default user
