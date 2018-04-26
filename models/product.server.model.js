const bcrypt = require('bcryptjs');
let uniqueValidator = require('mongoose-unique-validator');
const mongooseStringQuery = require('mongoose-string-query');
const timestamps = require('mongoose-timestamp');
// const uuidv1 = require('uuid/v1');
const uuidv4 = require('uuid/v4');
exports = module.exports = function (mongoose) {
    Schema = mongoose.Schema;

    //If this conflicts with your application you can configure as such:(可以自定义版本号)
    // new Schema({..}, { versionKey: '_somethingElse' })
    let ProductSchema = new Schema({
        name: {
          type: String
        },
        categoryId: {
            type: String,
            required: true
        },
        characteristic: { // 描述
            type: String,
            unique: false,
            required: true,
            trim: true
        },
        commission: {  // 佣金
            type: Number
        },
        commissionType: {
            type: Number
        },
        logisticsId: {  // 物流Id
            type: Number
        },
        minPrice: {  // 最低价格
            type: Number,
            required: true
        },
        minScore: {  // 最低积分
            type: Number
        },
        numberFav: {  //
            type: Number
        },
        numberGoodReputation: {  // 等级
            type: Number
        },
        numberOrders: {  // 订单数量
            type: Number
        },
        originalPrice: { // 原价
            type: Number
        },
        sort: {   // 排序
            type: Number,
            defult: 0
        },
        recommendStatus: { // 推荐状态 0：普通，1：今日推荐，2：优惠商品
            type: Number,
            defult: 0
        },
        recommendStatusStr: { // 推荐状态字符
            type: String,
            default:'普通'
        },
        pic: {
            type: String,
            required: true
        },
        shopId: {
            type: String,
            required: true,
        },
        status: { // 上架状态 0 下架 ，1 上架
            type: Number,
            default: 1
        },
        statusStr: {
            type: String,
            default: '上架'
        },
        stores: {  // 库存
            type: Number,
            default: 0
        },
        userId: {  // 用户ID
            type: String,
        },
        videoId: {  //
            type: String,
        },
        views: {  //浏览数量
            type: Number,
        },
        weight: {  //质量
            type: Number,
        }
    }, {_id: true, autoIndex: false}); // setting schema options{ _id: true, autoIndex: false }

    // schema static method  //page fetch  one page has 5 default data
    ProductSchema.statics = {
        fetch(id, pages, sortNum, cb) {
            console.log('pages: ' + pages)
            let pageSize = pages||5;
            let sortKind = sortNum || -1; // id：-1时间倒叙
            if (id) {
                return this.find({'_id': {"$lt": id}})
                    .select({})    //.select('_id createdAt userId shopName dateType remark key')
                    .limit(pageSize)
                    .sort({'_id': sortKind})
                    .exec(cb);
            } else {
                return this.find({})
                    .select({})
                    .limit(pages)
                    .sort({'_id': sortKind})
                    .exec(cb);
            }

        }
    };

    ProductSchema.plugin(timestamps);
    ProductSchema.plugin(mongooseStringQuery);
    ProductSchema.plugin(uniqueValidator, {message: 'error_unique_{PATH}'});
    let Product = mongoose.model('product', ProductSchema);
    Product.on('index', function (err) {
        if (err) {
            console.log('errorModel:' + err)
        }
    });
    module.exports = Product;
};