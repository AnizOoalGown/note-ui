import request from '@/utils/request'

export function getVerifyCode() {
    return request({
        url: '/verifyCode',
        method: 'get'
    })
}