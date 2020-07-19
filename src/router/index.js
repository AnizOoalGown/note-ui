import Vue from 'vue'
import Router from 'vue-router'
import Layout from "@/views/layout/Layout"

Vue.use(Router)

export const routes = [
    {
        path: '/',
        component: Layout,
        children: [
            {
                path: '/note',
                component: () => import('@/views/note/NoteLayout'),
                children: [
                    {
                        path: '',
                        component: () => import('@/views/about/About'),
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

export default new Router({
    mode: 'history',
    routes
})