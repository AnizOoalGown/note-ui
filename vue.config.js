module.exports = {
    devServer: {
        port: 80,
        proxy: {
            '/api': {
                target: 'http://localhost:8080',
                ws: false,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
}