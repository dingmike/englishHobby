
let uuid = require('uuid');
// let uuid = require('node-uuid');

exports = module.exports = function(mongoose) {
    let Schema = mongoose.Schema;
    let acl_resourceSchema = new Schema({
        id:{
            type:'string',
            primaryKey: true,
            defaultsTo: function() {
                return uuid.v4();
            }
        },
        name: {
            type:'string',
            columnName: 'name'
        },
        pId:{
            type:'string',
            columnName: 'pId'
        },
    });
    module.exports = mongoose.model('acl_resource', acl_resourceSchema);
};

