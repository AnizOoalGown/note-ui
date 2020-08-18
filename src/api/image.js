import request from '@/utils/request'

export function createImage(noteId, data) {
    return request({
        url: '/images',
        method: 'post',
        params: {noteId},
        data: data,
        headers: {}
    })
}

export function deleteImage(noteId, no) {
    return request({
        url: '/images',
        method: 'delete',
        params: {noteId, no}
    })
}