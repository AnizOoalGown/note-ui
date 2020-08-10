import request from '@/utils/request'

export function getNoteById(id) {
    return request({
        url: '/notes/' + id,
        method: 'get'
    })
}

export function createNote() {
    return request({
        url: '/notes',
        method: 'post'
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
        url: '/notes' + id,
        method: 'delete'
    })
}