import axios from 'axios'
import {Notification} from 'element-ui'

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

const service = axios.create({
    baseURL: '/api',
    timeout: 10000
})

// service.interceptors.request.use()

service.interceptors.response.use(res => {
    if (res.data.code !== 200) {
        Notification.error({
            title: res.data.code,
            message: res.data.msg
        })
        return Promise.reject(res)
    }
    else {
        return res.data
    }
})

export default service