module.exports={
    pages: {
        index: {
            entry: './src/main.js',
            template: './public/index.html',
            filename: 'index.html',
            title: '竞训-登陆'
        },
        main: {
            entry: './src/views/main/main.js',
            template: './public/main/main.html',
            filename: 'main.html',
            title: '竞训-主页'
        },
        studioInfo: {
            entry: './src/views/studioInfo/main.js',
            template: './public/studioInfo/studio.html',
            filename: 'studio.html',
            title: '信息'
        }
    }
}