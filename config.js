
let config = {
    db: {
        options: {
            // db: {native_parser: true}, // 过时不适用
            // server: {poolSize: 5},
            socketTimeoutMS: 0,
            keepAlive: true,
            reconnectTries: 30
//  replset: { rs_name: 'myReplicaSetName' },
//  user: 'admin',
//  pass: '123456'
        },
        uri: process.env.MONGO_URL || 'mongodb://127.0.0.1/hobbydb'
    },
    porthttp: process.env.PORT || 3311,
    SSLPORT: 18081,
    multicore: false, // 多线程运行
    https: true,
    debug: false
};
module.exports = config;