import Vue from 'vue'
import Router from 'vue-router'
import Layout from "@/views/layout/Layout"

Vue.use(Router)

export const routes = [
    {
        path: '/',
        redirect: '/note',
        component: Layout,
        children: [
            {
                path: '/note',
                component: () => import('@/views/note/NoteLayout'),
                children: [
                    {
                        path: '',
                        component: () => import('@/views/note/DefaultNote'),
                    },
                    {
                        path: ':id',
                        component: () => import('@/views/note/NoteEditor'),
                    }
                ]
            },
            {
                path: '/profile',
                component: () => import('@/views/profile/Profile')
            },
            {
                path: '/about',
                component: () => import('@/views/about/About')
            }
        ]
    },
    {
        path: '/login',
        component: () => import('@/views/login/Login')
    }
]

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

export default new Router({
    mode: 'history',
    routes
})