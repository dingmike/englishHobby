let bcrypt = require('bcryptjs');
let moment = require('moment');
let async = require('async');
let mongoose = require('mongoose');
let Shop = mongoose.model('shop');
let requestIp = require('request-ip');
let SECRET_TOKEN = "GUSTA_O0000";
let jwtAuth = require('../app/libs/jwt');
let util = require('../app/libs/util');

exports.getValue = function (req, res) {
    console.log(req.body.key);
    console.log('params:' + req.query.key);
    let params = {key:req.query.key||req.body.key}; // 取参数req.query
    Shop.findOne(params, {}, function (err, doc) {
        if (err) {
            res.status(500).send('internal_server_error');
        } else {
            if (doc) {
                res.status(200).send({
                    code:0,
                    data:doc,
                    msg:'success'
                })
            } else {
                res.status(500).send('shop_not_found');
            }
        }
    });
};
exports.setValue = function (req, res) {
    let data = req.body;
    console.log(data.dataType);
    let shopModel = new Shop(data);
    shopModel.dataType = data.dataType;
    shopModel.shopName = data.shopName; // 店铺名称
    shopModel.remark = data.remark;
    shopModel.userId = data.userId;
    // userModel.password = bcrypt.hashSync(data.password);
    if (data) {
        if (!data.dataType) {
            return res.status(500).send({   // ==res.json()
                code: 500,
                msg: '数据类型必填!'
            });
        } else if (!data.shopName) {
            return res.status(500).send({   // ==res.json()
                code: 500,
                msg: '店铺名称必填!'
            });
        } else if (!data.userId) {
            return res.status(500).send({   // ==res.json()
                code: 500,
                msg: '没有用户ID!'
            });
        } else if (!data.remark) {
            return res.status(500).send({   // ==res.json()
                code: 500,
                msg: '店铺描述必填!'
            });
        }

        Shop.findOne({shopName: data.shopName}, function(err, shopDoc){
            console.log(err);
            /*if (err) {
                return res.status(500).send(err);
            }*/
            if(shopDoc){
                return res.status(500).send({
                    code: 500,
                    msg: '店铺已存在!'
                })
            } else {
                shopModel.save(function (err, doc) {
                    console.log('doc:' + doc);
                    if (err) {
                        res.status(500).send(err);
                    } else {
                        res.status(200).send({
                            code: 200,
                            data: doc,
                            msg: 'Create shop successful!'
                        })
                    }
                });
            }

        });

    }
};
