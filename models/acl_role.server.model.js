
// let uuid = require('node-uuid');
let uuid = require('uuid');

exports = module.exports = function(mongoose) {
    let Schema = mongoose.Schema;
    let acl_roleSchema = new Schema({
        id:{
            type:'string',
            primaryKey: true,
            unique: true,
            defaultsTo: function() {
                return uuid.v4();
            }
        },
        name: {
            type:'string',
        },
    });
    module.exports = mongoose.model('acl_role', acl_roleSchema);
};