const bcrypt = require('bcryptjs')

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


    // schema static method  //page fetch  one page has 5 default data
    UserSchema.statics = {
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
// 钩子函数，指定 save() 之前的操作
    UserSchema.pre('save', function (next) {
        const user = this;
        // 上文中的“缓慢参数”
        const SALT_FACTOR = 10;
        // 随机生成盐
        bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
            if (err) return next(err);
           // console.log('userpassss: ' + user.password);
            // 加盐哈希
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err);
                user.password = hash;
               // console.log('pas: ' + user.password);
                next()
            })
        })
    });

    UserSchema.methods.comparePassword = function (password, cb) {
        // 对比
        bcrypt.compare(password, this.password, function (err, isMatch) {
            if (err) { return cb(err) }
            cb(null, isMatch)
        })
    };


    UserSchema.plugin(timestamps);
    UserSchema.plugin(mongooseStringQuery);
    UserSchema.plugin(uniqueValidator,{ message: 'error_unique_{PATH}' });
    let User = mongoose.model('users', UserSchema);
    User.on('index', function (err) {
        if (err) {
            console.log('errorModel:' + err)
        }
    });
    module.exports = User;
};