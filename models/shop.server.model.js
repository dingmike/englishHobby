const bcrypt = require('bcryptjs')

let uniqueValidator = require('mongoose-unique-validator');
const mongooseStringQuery = require('mongoose-string-query');
const timestamps = require('mongoose-timestamp');
// const uuidv1 = require('uuid/v1');
const uuidv4 = require('uuid/v4');
exports = module.exports = function (mongoose) {
    let Schema = mongoose.Schema;
    let ShopSchema = new Schema({
        userId: {
            type: String,
            required: true
        },
        shopName: {
            type: String,
            unique: true,
            required: true,
            trim: true
        },
        dateType: {
            type: Number
        },
        remark: {
            type: String,
            unique: true,
            required: false,
            trim: true
        },
        key: {
            type: String,
            unique: true,
            required: false,
            default:'mallName'
        }
    }, {_id: true, autoIndex: false}); // setting schema options{ _id: true, autoIndex: false }

    // schema static method  //page fetch  one page has 5 default data
    ShopSchema.statics = {
        fetch(id, pages, sortNum, cb) {
            let pageSize = pages || 5;
            let sortKind = sortNum || -1;
            if (id) {
                return this.find({'_id': {"$lt": id}})
                    .select('_id createdAt userId shopName dateType remark key')
                    .limit(pageSize)
                    .sort({'_id': -1})
                    .exec(cb);
            } else {
                return this.find({})
                    .select('_id createdAt userId shopName dateType remark key')
                    .limit(pages)
                    .sort({'_id': -1})
                    .exec(cb);
            }

        }
    };

    ShopSchema.plugin(timestamps);
    ShopSchema.plugin(mongooseStringQuery);
    ShopSchema.plugin(uniqueValidator, {message: 'error_unique_{PATH}'});
    let Shop = mongoose.model('shop', ShopSchema);
    Shop.on('index', function (err) {
        if (err) {
            console.log('errorModel:' + err)
        }
    });
    module.exports = Shop;
};