
// let uuid = require('node-uuid');
let uuid = require('uuid');
let uniqueValidator = require('mongoose-unique-validator');
exports = module.exports = function(mongoose) {
    let Schema = mongoose.Schema;
    let Acl_userSchema = new Schema({
        email: {
            type: String,
            match: [/.+\@.+\..+/, "invalid_email_address"],
            unique: true,
            required: 'email_required'
        },
        name: String,
        image: {
            type: String,
            default: '50x50defaultAvatar.png'
        },
        firstName: String,
        lastName: String,
        username: {
            type: String,
            unique: true,
            required: 'username_required',
            trim: true
        },
        password: {
            type: String
        },
        created: {
            type: Date,
            default: Date.now
        },
        role: String,
        convAbiertas: {
            type: Array,
        },
        age: Number,
        sexo: String
    });
    Acl_userSchema.plugin(uniqueValidator,{ message: 'error_unique_{PATH}' });
    module.exports = mongoose.model('acl_user', Acl_userSchema);
};

