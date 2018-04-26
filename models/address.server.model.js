const bcrypt = require('bcryptjs');

let uniqueValidator = require('mongoose-unique-validator');
const mongooseStringQuery = require('mongoose-string-query');
const timestamps = require('mongoose-timestamp');
// const uuidv1 = require('uuid/v1');
const uuidv4 = require('uuid/v4');
exports = module.exports = function(mongoose) {
    Schema = mongoose.Schema;
    let AddressSchema = new Schema({
        unionid:{
            type: String,
            unique: true,
            default: () => {
                return uuidv4();
            }
        },
        openid:{
            type: String,
            unique: true,
            default: () => {
                return uuidv4();
            }
        },
        email: {
            type: String,
            match: [/.+\@.+\..+/, "invalid_email_address"],
            unique: true,
            required: false
        },
        headimgurl: {
            type: String,
            default: '50x50defaultAvatar.png'
        },
        nickname: {
            type: String,
            unique: true,
            required: false,
            trim: true
        },
        username:{
            type: String,
            unique: true,
            required: false,
            trim: true
        },
        userCountry: {
            type: String
        },
        userProvince: {
            type: String
        },
        userCity:{
            type: String
        },
        password: {
            type: String
        },
        roles: {
            type: Array,
            required: false,
            default: ['user']   // role: user, admin, editor
        },
        age: Number,
        sex: String,  //用户的性别，值为1时是男性，值为2时是女性，值为0时是未知
        score: {
            type: Number,
            required: false,
            default: 0
        },
        realName: {
            type: String,
            required: false,
            trim: true
        },
        realAddress: {
            type: String,
            required: false
        },
        phone: {
            type: Number,
            required: false
        },
        money: {
            type: Number,
            required: false
        },
        readPages: {
            type: Number,
            required: false,
            default: 0
        },
        isAnswerToday: {
            type: Boolean,
            required: false,
            default: false
        },
        enableScore: {
            type: Number,
            required: false,
            default: 0    //0 ：可以使用积分，1：不可以使用
        },
        redeemedGift: [{ type: Schema.Types.ObjectId, ref: 'UserGiftOrder' }]

    },{ _id: true, autoIndex: false }); // setting schema options{ _id: true, autoIndex: false }

    // schema static method  //page fetch  one page has 5 default data
    AddressSchema.statics = {
        fetch(id, pages, sortNum, cb) {
            let pageSize = pages || 5;
            let sortKind = sortNum || -1;
            if (id) {
                return this.find({'_id': {"$lt": id}})
                    .select('_id createdAt nickname gender address phone money roles score readPages email isAnswerToday enableScore')
                    .limit(pageSize)
                    .sort({'_id': -1})
                    .exec(cb);
            } else {
                return this.find({})
                    .select('_id createdAt nickname gender address phone money roles score readPages email isAnswerToday enableScore')
                    .limit(pages)
                    .sort({'_id': -1})
                    .exec(cb);
            }

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