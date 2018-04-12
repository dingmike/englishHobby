'use strict';

// let Redis = require('redis');
let config = require('../../config');
let moment = require('moment');

// let SECRET_TOKEN = "GUSTA_O0000";
let requestIp = require('request-ip');
let jwt = require('jsonwebtoken');

/*
*
* new jwt token
* */

function generaTokenUser(id_user, req) {
    // Moment.js被用来设置token将在3天之后失效。
    let newToken = {
        id_user: id_user,
        iat: moment().unix(),
        expireIn: moment().add(config.expireDays, "days").unix(),
        // expireIn: moment().add(20, "seconds").unix(),
        host: requestIp.getClientIp(req)
    };
    console.log(newToken.host);
    //console.log(newToken)
    return jwt.sign(newToken, config.SECRET_TOKEN);
}

function getTokenAndVertify(req, res, next) {

    let bearerToken = req.headers["authorization"];
    console.log('bearerToken: ' + bearerToken)
    /* if (typeof bearerHeader !== 'undefined') {
         let bearer = bearerHeader.split(" ");
         bearerToken = bearer[1];
         let token = jwt.decode(bearerToken, {complete: true});

         console.log('token.token: '+ token)
         console.log('token.payload.exp: '+ token.payload.exp)
         console.log('tmoment().unix(): '+ moment().unix())
         try {


             if ((token.payload.exp <= moment().unix())) {
                 next('token_expire')
             } else {
                 //verificando mismo host de usuario
                 next(null, res, token.payload)

                /!* if (token.payload.host !== requestIp.getClientIp(req)) {
                     next('token_host_invalid')
                 } else {
                     next(null, token.payload)
                 }*!/
             }
         } catch (e) {
             next('token_host_invalid')
         }

     } else {
         return next('token_not_found')
     }
 */

    //verify the token
    jwt.verify(bearerToken, config.SECRET_TOKEN, (err, decode) => {
        if (err) {
            console.log('verify err---------------------->' + err);
            return res.json({code: 401, data: {inernalError: 'Error inernal'}, msg: err});
        } else {
            //verify OK
            let expireIn = decode.expireIn; // expire time is seconds
            console.log('expireIN:' + decode.id_user + "————expireIn：" + decode.expireIn);
            let userId = decode.id_user;

            console.log('decode.expireIn: ' + decode.expireIn);
            console.log('decode.iat: ' + decode.iat);
            console.log('decode.moment().unix(): ' + moment().unix());

            if (decode.host !== requestIp.getClientIp(req)) {
                return res.json({
                    code: 401,
                    msg: 'Token host invalid!'
                })
            } else {
                if ((decode.expireIn <= moment().unix())) {
                    return res.json({
                        code: 401,
                        msg: 'Token expire!'
                    })
                } else {
                    /* res.json({
                         code:200,
                         msg:'Verify the token!'
                     })*/
                    console.log('Verify the token!')
                    next(null, decode);
                }
            }
            //if token is in or not in
            /*redisClient.exists(userId, function(e, ret){
                if(e) throw e;
                console.log('ret-->----------------' + ret);
                if(ret){
                    //该token有效，重置token过期时间 1h  =3600s  有发起请求经过验证就会 refresh 时间 维持一直验证通过状态
                    redisClient.expire(userId, expireIn);
                    // redisClient.expireat(userId, parseInt((+new Date)/1000) + 86400); //设置过期时间为某个具体时间
                    console.log('in the token+++++++++')
                    next();
                }else{
                    //token invalid
                    console.log('Sorry token invalid');
                    return res.send({code: 401, msg: 'expire invalid token'});
                    next();
                }
            });*/
        }

    });

}

module.exports = {
    getTokenAndVertify: getTokenAndVertify,
    generaTokenUser: generaTokenUser
}