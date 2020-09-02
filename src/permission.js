import router from './router'
import store from './store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {getToken} from '@/utils/token'
import {getUser} from "@/api/user";

NProgress.configure({ showSpinner: false })

const whiteList = ['/login']

router.beforeEach((to, from, next) => {
    NProgress.start()
    if (getToken()) {
        if (to.path === '/login') {
            next({ path: '/' })
            NProgress.done()
        }
        else {
            if (!store.getters.username || !store.getters.userId) {
                getUser().then(res => {
                    store.commit('setUser', res.data)
                    next({ ...to, replace: true })
                }).catch(err => console.log(err))
            }
            else {
                next()
            }
        }
    } else {
        if (whiteList.indexOf(to.path) !== -1) {
            next()
        } else {
            if (to.matched.length > 1 && to.matched[1].path === '/note') {
                next('/login?redirect=/note')
            }
            else {
                next(`/login?redirect=${to.path}`)
            }
            NProgress.done()
        }
    }
})

router.afterEach(() => {
    NProgress.done()
})
