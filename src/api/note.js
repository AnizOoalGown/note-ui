import request from '@/utils/request'

export function getNoteById(id) {
    return request({
        url: '/notes/' + id,
        method: 'get'
    })
}

export function getMenuTreeByUserId(userId) {
    return request({
        url: '/notes/menuTree',
        method: 'get',
        params: {userId}
    })
}

export function createNote(note) {
    return request({
        url: '/notes',
        method: 'post',
        data: note
    })
}

export function updateNote(note) {
    return request({
        url: '/notes',
        method: 'put',
        data: note
    })
}

export function deleteNote(id) {
    return request({
        url: '/notes/' + id,
        method: 'delete'
    })
}