import request from '@/utils/request'

export function login(username, password, uuid, verifyCode) {
    const formData = new FormData()
    formData.append('username', username)
    formData.append('password', password)
    formData.append('uuid', uuid)
    formData.append('verify_code', verifyCode)

    return request({
        url: '/login',
        method: 'post',
        data: formData
    })
}

export function logout() {
    return request({
        url: '/logout',
        method: 'get'
    })
}

export function getUser(id) {
    return request({
        url: '/users',
        method: 'get',
        params: {id}
    })
}

export function createUser(username, password, uuid, verifyCode, inviteCode) {
    const formData = new FormData()
    formData.append('username', username)
    formData.append('password', password)
    formData.append('uuid', uuid)
    formData.append('verify_code', verifyCode)
    formData.append('invite_code', inviteCode)

    return request({
        url: '/users',
        method: 'post',
        data: formData
    })
}

export function updateUsername(id, username) {
    const formData = new FormData()
    formData.append('username', username)

    return request({
        url: '/users/' + id,
        method: 'put',
        data: formData
    })
}

export function updatePassword(id, password, newPassword) {
    const formData = new FormData()
    formData.append('password', password)
    formData.append('newPassword', newPassword)

    return request({
        url: '/users/' + id,
        method: 'put',
        data: formData
    })
}

export function deleteUser(id, password) {
    const formData = new FormData
    formData.append('password', password)

    return request({
        url: '/users/close/' + id,
        method: 'post',
        data: formData
    })
}