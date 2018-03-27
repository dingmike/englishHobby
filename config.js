
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
    SSLPORT: process.env.PORT || 8080,
    multicore: false, // 多线程运行
    // https: true,
    debug: true,
    wechatToken: '123123123123qazwsx',  //J1nWTPmIiMtLxDzmysLIItz59aC2sTce9qVyGR0sIJr
    wechatConfig: {
        'token': '123123123123qazwsx',
        'appId': 'wx83a881064cf3448a', //wx83a881064cf3448a  wx1ce65521ad23e942  my  res.end(resMsg);     my  wx26da9cc232f8399f  test wx83a881064cf3448a
        'appSecret': '927fc61a9555028a6236e90ac7a68e8a', // my df5a5e6028b8fba20bfa79cefe893b4c   test 927fc61a9555028a6236e90ac7a68e8a
        'turingKey': '94bb7a64cc567365d9046fc01716a3d5',
        'zhihuCookie': 'd_c0="ACCAX7ZGvgmPTkoI6M1Y_pZMv4ulQz2oM0s=|1460168043"; _za=7fb46797-31a2-4d5b-b07d-18053e015be4; _zap=40aa0788-b6af-473d-a803-d3456a851afe; q_c1=5cd4f50dfe3f4bdfb84102b1b1b4beeb|1469495568000|1464228898000; _xsrf=7910d14bef55d5c996a197045f6d1088; _ga=GA1.2.228887280.1468222913; s-q=vczh; s-i=3; sid=0uv8hr3g; s-t=autocomplete; l_cap_id="ZTFlY2YxMTc5NmRlNDA3MmE5ZjY2ZDgzOGRhNTU4NjM=|1470658266|b45c3f5a4b4b218eeada0056248af6e7b6fe4f81"; cap_id="NTg4M2IwYjIxYjM5NDhmMWJiM2Y4YzdiNDlmOTFkMDU=|1470658266|39e84c4c2e65bedda03c6bd72bb1e6e6bf922edf"; login="NzYyYmY0MWU5NDM4NDI5ZTlmNmU3YzMwYjVkY2Q1OTY=|1470658280|f58e1f4c7f32b2862c2974bd5e050295d4f25f1d"; __utmt=1; n_c=1; __utma=51854390.228887280.1468222913.1470641625.1470657896.13; __utmb=51854390.39.9.1470658285295; __utmc=51854390; __utmz=51854390.1470378766.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); __utmv=51854390.100-1|2=registration_date=20130821=1^3=entry_date=20130821=1; a_t="2.0AABAZUgdAAAXAAAAIAXQVwAAQGVIHQAAACCAX7ZGvgkXAAAAYQJVTRUF0FcAA9qRB-Jd0PN85jjcGYO4Ohgzjn52PcmWSQY4I8rfNWrXPB6FWQXNvg=="; z_c0=Mi4wQUFCQVpVZ2RBQUFBSUlCZnRrYS1DUmNBQUFCaEFsVk5GUVhRVndBRDJwRUg0bDNRODN6bU9Od1pnN2c2R0RPT2Zn|1470658592|161a5e5b60a1de96829eb2f5c2f01ccc96fb04ee',
        'zhihuXsrfToken': '7910d14bef55d5c996a197045f6d1088'
    },
    wechatNewConf:{
        token: '123123123123qazwsx',
        appid: 'wx83a881064cf3448a',
        // encodingAESKey: '927fc61a9555028a6236e90ac7a68e8a',
        checkSignature: false // 可选，默认为true。由于微信公众平台接口调试工具在明文模式下不发送签名，所以如要使用该测试工具，请将其设置为false
    }
};
module.exports = config;