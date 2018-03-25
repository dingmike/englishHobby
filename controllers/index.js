let controllers = {};
let mongoose = require('mongoose');
let fs = require('fs');
let config = require('../config.js');
let models = require('../models');
let acl =  require('acl');
let dbconnection = mongoose.connect(config.db.uri, function (err, db) {
    if (err) {
        console.log('MongoDb: Connection error: ' + err)
    }else{
        console.log('MongoDb is connected..............');
        // node_acl 权限模块
        console.log("Lets do this to " + db);
        acl = new acl(new acl.mongodbBackend(db, "acl_"));
        // initialize acl system storing data in the redis backend

        /* now assign permissions to roles */

        // allow guests to view posts
        acl.allow("guest", "/index", "view");

// allow registered users to view and create posts
//acl.allow("registered users", "post", ["view", "create"]);

// allow administrators to perform any action on posts

        acl.allow("administrator", "/", "*");
    }

});
// init 数据模型
models(mongoose);
// require('../models')(mongoose);

// node_acl 权限模块
/*mongoose.connection.on('open', function (ref) {
    console.log('Connected to mongo server.');
    //var dbconnection = mongoose.connect('mongodb://localhost/acl-test', {});
    console.log("Lets do this to " + dbconnection.connection.db)
    acl = new acl(new acl.mongodbBackend(dbconnection.connection.db, "acl_"));

// initialize acl system storing data in the redis backend
//acl = new acl(new acl.mongodbBackend(dbconnection, "acl_"));

    /!* now assign permissions to roles *!/

// allow guests to view posts
    acl.allow("guest", "/index", "view");

// allow registered users to view and create posts
//acl.allow("registered users", "post", ["view", "create"]);

// allow administrators to perform any action on posts
//
    acl.allow("administrator", "/", "*");
});*/
mongoose.connection.on('error', function (err) {
    console.log('Could not connect to mongo server!');
    console.log(err);
});





let walk = function (path) {
    fs.readdirSync(path).forEach(function (file) {
        let newPath = path + '/' + file;
        let stat = fs.statSync(newPath);
        if (stat.isFile()) {
            if (/(.*)\.(js|coffee)/.test(file)) {
                if (file !== 'index.js') {
                    let indent = file.split('.');
                    controllers[indent[0]] = require(newPath);
                }
            }
        } else if (stat.isDirectory()) {
            // walk(newPath);
        }
    });
};
let models_path = __dirname;
walk(models_path);

module.exports = controllers;
