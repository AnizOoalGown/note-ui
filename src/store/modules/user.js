const user = {
    state: {
        id: undefined,
        username: undefined
    },

    mutations: {
        setUser: (state, user) => {
            state.id = user.id
            state.username = user.username
        }
    }
}

export default user
