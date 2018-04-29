let bcrypt = require('bcryptjs');
let moment = require('moment');
let async = require('async');
let mongoose = require('mongoose');
let User = mongoose.model('users');
let Address = mongoose.model('address');
let requestIp = require('request-ip');
let SECRET_TOKEN = "GUSTA_O0000";
let jwtAuth = require('../app/libs/jwt');
let util = require('../app/libs/util');

exports.authenticate = function (req, res) {
    console.log('Start login in the system..............');
    console.log('hjehe:' + req.is('application/json'))
    console.log('IPREAL:' + util.getClientIp(req))


    console.log('Request IP :' + req.ip)
    console.log('Request IPs :' + req.ips)
    /*  if (!req.is('application/json')) {
     return  res.status(500).send('application/json only!')
     }*/
    console.log('req+++++++++' + req.body);
    console.log(req.originalUrl); // '/admin/new'
    console.log(req.baseUrl); // '/admin'
    console.log(req.path); // '/new'
    console.log(req.params); // '/new'
    /*for(var key in req){
     console.log(req[key])
     }*/
    console.log('req.body:  ' + req.body.username);  // 取body内容数据
    console.log('req.query:  ' + req.query.usernames); //取参数req.query

    if (!req.body.username) {
        res.status(500).send({   // ==res.json()
            code: 500,
            msg: 'No username or email!'
        });
    } else if (!req.body.password) {
        res.status(500).send({   // ==res.json()
            code: 500,
            msg: 'No password!'
        });
    } else {
        // 用户名和email均可以登录
        User.findOne({"$or": [{username: req.body.username}, {email: req.body.username}]}, function (err, user) {
            if (err) {
                res.status(500).send(
                    {
                        code: 500,
                        msg: 'Internal server error!'
                    });
            } else {
                if (user) {
                    console.log("USER:  " + user);
                    //bcrypt.compareSync(req.body.password, user.password)
                    user.comparePassword(req.body.password, function (err, isMatch) {
                        if (err) {
                            return console.log(err)
                        }
                        // 密码不匹配
                        if (!isMatch) {
                            return res.status(500).json({
                                code: 500,
                                msg: 'Invaild username or password!'
                            })
                        } else {
                            // 匹配成功
                            let token = jwtAuth.generaTokenUser(user._id, req);
                            console.log('token:' + token);
                            user["password"] = null;
                            console.log('myname:' + user.username);
                            return res.status(200).send({
                                code: 200,
                                data: user,
                                token: token
                            });
                        }
                    })
                } else {
                    res.status(500).send({   // ==res.json()
                        code: 500,
                        msg: 'User not found!'
                    });
                }
            }
        });
    }


};
exports.get = function (req, res) {
    User.findOne({username: req.params.username}, function (err, user) {
        if (err) {
            res.status(500).send('internal_server_error');
        } else {
            if (user) {
                res.status(200).send(user)
            } else {
                res.status(500).send('user_not_found');
            }
        }
    });
};
exports.test = function (req, res) {

    //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjoiNWFjZWY4ZmJjOTM4ZDEzNDZjOTk1NGUwIiwiaWF0IjoxNTIzNTIxNzU1LCJleHAiOjE1MjM3ODA5NTUsImhvc3QiOiI6OmZmZmY6MTkyLjE2OC4xNi4xOTgifQ.VLicGl21o7-nrmb8N5jU9EGiz4OJFeKSzlb-d27t_lo
    //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c2VyIjoiNWFjZWY4ZmJjOTM4ZDEzNDZjOTk1NGUwIiwiaWF0IjoxNTIzNTIxODUyLCJleHAiOjE1MjM3ODEwNTIsImhvc3QiOiI6OmZmZmY6MTkyLjE2OC4xNi4xOTgifQ.tQwu8ukAof2UMm-oApOPe6QfT2_bHiRS9t4G91n4nzE
    jwtAuth.getTokenAndVertify(req, res, function (err, token) {
        if (err) {
            return res.status(403).send(err);
        }
        User.findOne({_id: token.id_user}, function (err, user) {
            if (user) {
                return res.status(200).send(user);
            } else {
                return res.status(403).send(err);
            }
        });
    })
};

exports.delete = (req, res) => {
    let data = req.body;
    if (data) {
        if (!data.userId) {
            return res.status(500).send({   // ==res.json()
                code: 500,
                msg: '没有用户ID!'
            });
        }
        if (!data.addressId) {
            return res.status(500).send({   // ==res.json()
                code: 500,
                msg: '没有收获信息ID!'
            });
        }
        User.findOne({_id: data.userId}, (err, userDoc) => {
            if (err) {
                return res.status(500).send(err);
            }
            let shipAddressArr = userDoc.shipAddress;
            shipAddressArr.remove(data.addressId);
            Address.remove({_id: data.addressId}, (err, obj) => {
                if (err) {
                    return res.status(500).send(err);
                }
                userDoc.save(err => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.status(200).send({   // ==res.json()
                        code: 200,
                        data: obj,
                        msg: 'delete successful'
                    });
                })


            })


        })
    }
};
Array.prototype.remove = function (val) {
    let index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};
exports.add = function (req, res) {
    let data = req.body;
    let address = new Address(data);
    if (data) {
        if (!data.userId) {
            return res.status(500).send({   // ==res.json()
                code: 500,
                msg: '没有用户ID!'
            });
        } else if (!data.userPhone) {
            return res.status(500).send({   // ==res.json()
                code: 500,
                msg: '手机号必填!'
            });
        }else if (!(/^1[34578]\d{9}$/.test(data.userPhone))) {
            return res.status(500).send({   // ==res.json()
                code: 500,
                msg: '手机号格式不正确!'
            });
        } else if (!data.userName) {
            return res.status(500).send({   // ==res.json()
                code: 500,
                msg: '收货人姓名必填!'
            });
        } else if (!data.province) {
            return res.status(500).send({   // ==res.json()
                code: 500,
                msg: '省必填!'
            });
        } else if (!data.city) {
            return res.status(500).send({   // ==res.json()
                code: 500,
                msg: '市必填!'
            });
        } else if (!data.county) {
            return res.status(500).send({   // ==res.json()
                code: 500,
                msg: '区县必填!'
            });
        } else if (!data.address) {
            return res.status(500).send({   // ==res.json()
                code: 500,
                msg: '详细地址必填!'
            });
        }
        address.save((err, newAddress) => {
            if (err) {
                res.status(500).send(err);
            } else {
                // 查询用户信息插入收货信息
                User.findById(data.userId, (err, userDoc) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    if (userDoc) {
                        userDoc.shipAddress.push(newAddress._id);
                        userDoc.save(err => {
                            if (err) {
                                res.status(500).send(err);
                            } else {
                                res.status(200).send({
                                    code: 200,
                                    data: newAddress,
                                    msg: 'Save successful!'
                                })
                            }
                        })

                    }

                })
            }
        });

    }

};
let generaTokenUser = function (id_user, req) {
    // Moment.js被用来设置token将在3天之后失效。
    let newToken = {
        id_user: id_user,
        iat: moment().unix(),
        exp: moment().add(3, "days").unix(),
        host: requestIp.getClientIp(req)
    };
    console.log(newToken.host)
    //console.log(newToken)
    return jwt.sign(newToken, SECRET_TOKEN);
};

let getToken = function (req, next) {
    let bearerToken;
    let bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        let bearer = bearerHeader.split(" ");
        bearerToken = bearer[1];
        let token = jwt.decode(bearerToken, {complete: true});
        try {
            if ((token.payload.exp <= moment().unix())) {
                next('token_expire')
            } else {
                //验证客户端是否更换IP登录
                if (token.payload.host !== requestIp.getClientIp(req)) {
                    next('token_host_invalid')
                } else {
                    next(null, token.payload)
                }
            }
        } catch (e) {
            next('token_host_invalid')
        }

    } else {
        return next('token_not_found')
    }
};
exports.getToken = getToken;
exports.UserAccess = function (perm) {
    return function (req, res, next) {
        getToken(req, function (err, token) {
            if (err) {
                return res.status(403).send(err);
            }
            // asegurando permiso de usuario en servidor
            if (!perm) {
                return next();
            }
            User.findOne({_id: token.id_user, role: perm}, function (err, user) {
                if (user) {
                    next();
                } else {
                    return res.status(403).send(err);
                }
            });
        })
    }
};
