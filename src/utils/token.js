const key = 'login-token'

export function getToken() {
    return localStorage.getItem(key)
}

export function setToken(token) {
    localStorage.setItem(key, token)
}

export function removeToken() {
    localStorage.removeItem(key)
}