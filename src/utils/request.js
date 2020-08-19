import axios from 'axios'
import store from '@/store'
import {Notification, MessageBox} from 'element-ui'
import {getToken, removeToken} from '@/utils/token'

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

const instance = axios.create({
    baseURL: '/api',
    timeout: 10000
})

instance.interceptors.request.use(
    config => {
        if (getToken()) {
            config.headers['Authorization'] = 'Bearer ' + getToken()
        }
        return config
    },
    error => {
        Notification.error(error)
    }
)

instance.interceptors.response.use(res => {
    const code = res.data.code
    if (code === 401) {
        MessageBox.confirm(
            '登录状态已过期，您可以继续留在该页面，或者重新登录',
            '系统提示',
            {
                confirmButtonText: '重新登录',
                cancelButtonText: '取消',
                type: 'warning'
            }
        ).then(() => {
            removeToken()
            store.commit('setUser', {
                id: undefined,
                username: undefined
            })
            location.reload()
        })
    }
    else if (code !== 200) {
        Notification.warning({
            title: res.data.code,
            message: res.data.msg
        })
        return Promise.reject(res.data)
    }
    else {
        return res.data
    }
}, error => {
    Notification.error(error.message)
    return Promise.reject(error)
})

export default instance