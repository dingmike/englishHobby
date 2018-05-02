const bcrypt = require('bcryptjs');

let uniqueValidator = require('mongoose-unique-validator');
const mongooseStringQuery = require('mongoose-string-query');
const timestamps = require('mongoose-timestamp');
// const uuidv1 = require('uuid/v1');
const uuidv4 = require('uuid/v4');
exports = module.exports = function(mongoose) {
    let Schema = mongoose.Schema;
    let AddressSchema = new Schema({
        userId: { type: Schema.Types.ObjectId, ref: 'users' },
        userName:{
            type: String,
            trim: true
        },
        userPhone: {
            type: String,
            match: [/^1[34578]\d{9}$/, "invalid_phone"],
            unique: false,
            required: false
        },
        province: {
            type: String,
            required: false,
            trim: true
        },
        city: {
            type: String,
            required: false,
            trim: true
        },
        county:{
            type: String,
            required: false,
            trim: true
        },
        address: {
            type: String,
            required: false,
            trim: true
        },
        postCode: {
            type: Number
        },
        isDefault: {
            type: Number,
            required: false,
            default: 0   // 0: 否, 1, 是
        },
        addressFlag: {
            type: Number,
            defult: 1   // -1: 删除，  1：有效
        }
    },{ _id: true, autoIndex: false }); // setting schema options{ _id: true, autoIndex: false }

    // schema static method  //page fetch  one page has 5 default data
    AddressSchema.statics = {
        fetchByUserId(id, pages, sortNum, cb) {
            let pageSize = pages || 5;
            let sortKind = sortNum || -1;
            if (id) {
                return this.find({_creator: id}).populate({
                    path: '_creator',
                    select: {realName: true, address: true, username: true, phone: true}
                }).populate({
                    path: '_giftProduct',
                    select: {giftTitle: true, giftIcon: true, expressFee: true, giftScore: true, giftPrice: true}  // // Explicitly exclude `_id`, see http://bit.ly/2aEfTdB select: 'name -_id',
                }).sort({'createdAt': sortKind}).exec(cb);
            } else {
                res.send({   // ==res.json()
                    code: 500,
                    msg: '没有该用户的地址记录！'
                });
            }
        },
        fetchAll(pages, sortNum, cb){
            return this.find({}).populate({
                path: '_creator',
                select: {realName: true, address: true, username: true, email: true, phone: true, realAddress: true}
            }).populate({
                path: '_giftProduct',
                select: {giftTitle: true, giftIcon: true, expressFee: true, giftScore: true, giftPrice: true,stock: true}  // // Explicitly exclude `_id`, see http://bit.ly/2aEfTdB select: 'name -_id',
            }).sort({'createdAt': -1}).exec(cb);
        }
    };

    AddressSchema.plugin(timestamps);
    AddressSchema.plugin(mongooseStringQuery);
    AddressSchema.plugin(uniqueValidator,{ message: 'error_unique_{PATH}' });
    let Address = mongoose.model('address', AddressSchema);
    Address.on('index', function (err) {
        if (err) {
            console.log('errorModel:' + err)
        }
    });
    module.exports = Address;
};