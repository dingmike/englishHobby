
module.exports = function(mongoose) {
    let fs = require('fs')
    let walk = function(path) {
        fs.readdirSync(path).forEach(function(file) {
            let newPath = path + '/' + file;
            let stat = fs.statSync(newPath);
            if (stat.isFile()) {
                if (/(.*)\.(js|coffee)/.test(file)) {
                    if (file != 'index.js') {
                        require(newPath)(mongoose);
                    }
                }
            } else if (stat.isDirectory()) {
                // walk(newPath);
            }
        });
    };
    let models_path = __dirname;
    walk(models_path);
}