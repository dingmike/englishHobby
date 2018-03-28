
// http://doxmate.cool/node-webot/wechat-api/api.html
module.exports = function (app, express, io) {
    let controllers = require('../controllers');
    let config = require('../config.js');
    const wxAuth = require('../app/libs/wxAuth');
    const crypto = require('crypto');
    /*app.route('/').get(function (req, res, next) {
        console.log('routering now 111--------------------------------' + req.method);
        // res.render('client');
        next();
    }); */

    // app.route('/').get(wxAuth); // 微信
// app.all('*',wxAuth); // 微信api认证


    app.all('*', function (req, res, next) {
        //  处理请求头部信息以及跨域
        res.header("Access-Control-Allow-Origin", "*");
        // res.writeHead(200, {'Content-Type': 'application/xml'});
        res.header('Access-Control-Allow-Methods', 'OPTIONS,GET,POST,PUT,DELETE');
        res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
        console.log('routering now  dd--------------------------------' + req.method);
        console.log('weixiinqingqiu;'+ req.query.signature);
        // 微信api认证
        // wxAuth(req, res, next);

    /*    if (req.query.signature) {
            let signature = req.query.signature;
            let timestamp = req.query.timestamp;
            let nonce = req.query.nonce;
            let echostr = req.query.echostr;

            /!*  加密/校验流程如下： *!/
            //1. 将token、timestamp、nonce三个参数进行字典序排序
            let array = new Array(config.wechatToken, timestamp, nonce);
            array.sort();
            let str = array.toString().replace(/,/g, "");

            //2. 将三个参数字符串拼接成一个字符串进行sha1加密
            let sha1Code = crypto.createHash("sha1");
            let code = sha1Code.update(str, 'utf-8').digest("hex");

            //3. 开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
            if (code === signature) {
                res.send(echostr)
            } else {
                res.send("error");
            }
        }*/

        if ('OPTIONS' === req.method) {
            console.log('routering now --------------------------------' + req.method);
            return res.sendStatus(200);
        }
        if (req.secure) {
            console.log('routering secure --------------------------------' + req.method);
            return next();
        }
        next();
    });
    let fs = require('fs');
    let walk = function (path) {
        fs.readdirSync(path).forEach(function (file) {
            let newPath = path + '/' + file;
            let stat = fs.statSync(newPath);
            if (stat.isFile()) {
                if (/(.*)\.(js|coffee)/.test(file)) {
                    if (file !== 'index.js') {
                        require(newPath)(app, express, controllers);
                    }
                }
            } else if (stat.isDirectory()) {
                // walk(newPath);
            }
        });
    };
    let models_path = __dirname;
    walk(models_path);
    io.use(function (socket, next) {
        if (!io.nicknames) {
            io.nicknames = {}
        }
        if (controllers.chat.IsValidSocketToken(socket)) {
            next();
        } else {
            next(new Error("not authorized"));
        }
    });
    // socket events
    io.on('connection', function (socket) {
        let headers = socket.handshake.headers;
        //console.log(headers);
        socket.on('event', function (data, fn) {
            controllers[data.c][data.f](io, socket, data.data, fn);
        });
        socket.on('disconnect', function () {
            let data = {
                c: 'chat',
                f: 'disconnect'
            };
            controllers[data.c][data.f](io, socket);
        });
    });
};