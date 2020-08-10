import axios from 'axios'
import {Notification} from 'element-ui'
import { getToken } from '@/utils/token'

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
    if (res.data.code !== 200) {
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