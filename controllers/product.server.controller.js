let bcrypt = require('bcryptjs');
let moment = require('moment');
let async = require('async');
let mongoose = require('mongoose');
let Product = mongoose.model('product');
let requestIp = require('request-ip');
let SECRET_TOKEN = "GUSTA_O0000";
let jwtAuth = require('../app/libs/jwt');
let util = require('../app/libs/util');


/*
* @params name status recommendStatus categoryId characteristic
* commission commissionType minPrice minScore numberGoodReputation originalPrice
* pic stores
*
* */
exports.add = function (req, res) {

    console.log('req.body: ' + req.body.name);   // 取body内容数据
    console.log('req.query: ' + req.query.name); // 取参数req.query
    let data = req.body;
    if (data.hasOwnProperty('status')) {
        data.statusStr = data.status == 1 ? '上架' : '下架';
    }
    if (data.hasOwnProperty('recommendStatus')) {
        switch (data.recommendStatus) {
            case 0 :
                data.recommendStatusStr = '普通';
                break;
            case 1 :
                data.recommendStatusStr = '今日推荐';
                break;
            case 2 :
                data.recommendStatusStr = '优惠商品';
                break;
            default:
                break;
        }
    }
    if (!data.name) {
        res.status(500).send({   // ==res.json()
            code: 500,
            msg: 'Product name required!'
        });
    } else if (!data.categoryId) {
        res.status(500).send({   // ==res.json()
            code: 500,
            msg: 'Product category required!'
        });
    } else if (!data.shopId) {
        res.status(500).send({   // ==res.json()
            code: 500,
            msg: 'Product shopId required!'
        });
    } else if (!data.characteristic) {
        res.status(500).send({   // ==res.json()
            code: 500,
            msg: 'Product characteristic required!'
        });
    } else if (!data.commission) { //佣金
        res.status(500).send({   // ==res.json()
            code: 500,
            msg: 'Product commission required!'
        });
    } else if (!data.commissionType) {
        res.status(500).send({   // ==res.json()
            code: 500,
            msg: 'Product commissionType required!'
        });
    } else if (!data.minPrice) {
        res.status(500).send({   // ==res.json()
            code: 500,
            msg: 'Product minPrice required!'
        });
    } else if (!data.minScore) {
        res.status(500).send({   // ==res.json()
            code: 500,
            msg: 'Product minScore required!'
        });
    } else if (!data.numberGoodReputation) {
        res.status(500).send({   // ==res.json()
            code: 500,
            msg: 'Product numberGoodReputation required!'
        });
    } else if (!data.originalPrice) {
        res.status(500).send({   // ==res.json()
            code: 500,
            msg: 'Product originalPrice required!'
        });
    } else if (!data.pic) {
        res.status(500).send({   // ==res.json()
            code: 500,
            msg: 'Product pic required!'
        });
    } else if (!data.stores) {
        res.status(500).send({   // ==res.json()
            code: 500,
            msg: 'Product stores required!'
        });
    } else {

        let product = new Product(data);
        // 用户名和email均可以登录
        Product.findOne({name: data.name}, function (err, productDoc) {
            if (err) {
                res.status(500).send(
                    {
                        code: 500,
                        msg: 'Internal server error!'
                    });
            } else {
                if (productDoc) {
                    return res.status(500).send({
                        code: 500,
                        msg: '商品名称已存在！'
                    });
                } else {
                    product.save(function (err, doc) {
                        if (err) {
                            res.status(500).send(err);
                        } else {
                            res.status(200).send({
                                code: 200,
                                data: doc,
                                msg: 'success!'
                            })
                        }
                    })
                }
            }
        });
    }


};
exports.get = function (req, res) {

    Product.findOne({_id: req.query._id}, {}, function (err, productDoc) {
        if (err) {
            res.status(500).send('internal_server_error');
        } else {
            if (productDoc) {
                res.status(200).send({
                    code: 200,
                    data: productDoc,
                    msg: 'success!'
                })
            } else {
                res.status(500).send({
                    code: 500,
                    msg: 'Product not found!'
                });
            }
        }
    });
};
exports.getList = function (req, res) {

    let params = req.body;
    //pager; get pages of the product
    Product.count({}, (err, count) => {
        if (err) {
            res.status(500).send('internal_server_error');
        }
        Product.fetch(params._id, parseInt(params.pages), params.sortNum, (err, docArr) => {
            if (err) {
                res.status(500).send('internal_server_error');
            }
            console.log('totalUserCounts: ' + count);
            res.status(200).send({
                code: 200,
                data: docArr,
                pages: req.body.pages,
                totalPages: count,
                msg: 'success'
            })
        })
    });


};
exports.edit = function (req, res) {
    console.log('req.body:  ' + req.body.name);  // 取body内容数据
    console.log('req.query:  ' + req.query.name); //取参数req.query
    let data = req.body;

    if (data.hasOwnProperty('status')) {
        data.statusStr = data.status == 1 ? '上架' : '下架';
    }
    if (data.hasOwnProperty('recommendStatus')) {
        data.statusStr = data.status == 1 ? '上架' : '下架';
        switch (data.recommendStatus) {
            case '0' :
                data.recommendStatusStr = '普通';
                break;
            case '1' :
                data.recommendStatusStr = '今日推荐';
                break;
            case '2' :
                data.recommendStatusStr = '优惠商品';
                break;
            default:
                break;
        }
    }
    if (!data.name) {
        res.status(500).send({   // ==res.json()
            code: 500,
            msg: 'Product name required!'
        });
    } else if (!data.categoryId) {
        res.status(500).send({   // ==res.json()
            code: 500,
            msg: 'Product category required!'
        });
    } else if (!data.characteristic) {
        res.status(500).send({   // ==res.json()
            code: 500,
            msg: 'Product characteristic required!'
        });
    } else if (!data.commission) { //佣金
        res.status(500).send({   // ==res.json()
            code: 500,
            msg: 'Product commission required!'
        });
    } else if (!data.commissionType) {
        res.status(500).send({   // ==res.json()
            code: 500,
            msg: 'Product commissionType required!'
        });
    } else if (!data.minPrice) {
        res.status(500).send({   // ==res.json()
            code: 500,
            msg: 'Product minPrice required!'
        });
    } else if (!data.minScore) {
        res.status(500).send({   // ==res.json()
            code: 500,
            msg: 'Product minScore required!'
        });
    } else if (!data.numberGoodReputation) {
        res.status(500).send({   // ==res.json()
            code: 500,
            msg: 'Product numberGoodReputation required!'
        });
    } else if (!data.originalPrice) {
        res.status(500).send({   // ==res.json()
            code: 500,
            msg: 'Product originalPrice required!'
        });
    } else if (!data.pic) {
        res.status(500).send({   // ==res.json()
            code: 500,
            msg: 'Product pic required!'
        });
    } else if (!data.stores) {
        res.status(500).send({   // ==res.json()
            code: 500,
            msg: 'Product stores required!'
        });
    } else {
        if (data._id) {
            Product.update({_id: data._id}, {$set: data}, function (err, updateDoc) {
                if (err) {
                    return res.send(500, err.message);
                } else {
                    console.log('success: ' + updateDoc.ok); // {"n": 1, "nModified": 1,"ok": 1}
                    if (updateDoc.ok === 1) {
                        res.status(200).send({
                            code: 200,
                            data: updateDoc,
                            msg: 'success'
                        });
                    }
                }
            });
        } else {
            res.status(500).send({   // ==res.json()
                code: 500,
                msg: 'Product ID required!'
            });
        }

    }
};

// 上架状态status status 0下架，1下架 statusStr

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

exports.signin = function (req, res) {
    let data = req.body;
    let userModel = new User(data);
    userModel.email = data.email;
    userModel.password = data.password;
    // userModel.password = bcrypt.hashSync(data.password);

    if (data) {
        if (data.roles) { //防止非法注册带权限
            return res.status(401).send({
                code: 401,
                msg: 'No permission!'
            })
        }

        if (!data.username) {
            return res.status(500).send({   // ==res.json()
                code: 500,
                msg: '用户名必填!'
            });
        } else if (!data.password) {
            return res.status(500).send({   // ==res.json()
                code: 500,
                msg: '密码必填!'
            });
        } else if (!data.email) {
            return res.status(500).send({   // ==res.json()
                code: 500,
                msg: 'Email必填!'
            });
        }

        User.findOne({"$or": [{username: data.username}, {email: data.email}]}, function (err, userDoc) {
            if (err) {
                return res.status(500).send(err);
            }
            if (userDoc) {
                return res.status(500).send({
                    code: 500,
                    msg: '用户名或者邮箱已被注册!'
                })
            } else {
                userModel.save(function (err, user) {
                    if (err) {
                        res.status(500).send(err);
                    } else {
                        user.password = 'Haha, I will call 110!';
                        res.status(200).send({
                            code: 200,
                            data: user,
                            token: jwtAuth.generaTokenUser(user._id, req),
                            msg: 'Login successful!'
                        })
                    }
                });
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
