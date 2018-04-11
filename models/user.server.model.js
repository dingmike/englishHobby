

let uniqueValidator = require('mongoose-unique-validator');
const mongooseStringQuery = require('mongoose-string-query');
const timestamps = require('mongoose-timestamp');
exports = module.exports = function(mongoose) {
    Schema = mongoose.Schema;
    let UserSchema = new Schema({
        unionid:{
            type: String,
            unique: true
        },
        openid:{
            type: String,
            unique: true
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

    });
    UserSchema.plugin(timestamps);
    UserSchema.plugin(mongooseStringQuery);
    UserSchema.plugin(uniqueValidator,{ message: 'error_unique_{PATH}' });
    module.exports = mongoose.model('users', UserSchema);
};