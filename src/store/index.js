import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import user from './modules/user'
import note from './modules/note'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        user,
        note
    },
    getters
})

export default store
