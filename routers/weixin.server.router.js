
// const wxAuth = require('../app/libs/wxAuth');


module.exports = function(app, express, controllers) {
    let weixin = express.Router();
    // res.writeHead(200, {'Content-Type': 'application/xml'});
    weixin.route('/').post(controllers.weixin.weixin);
    // weixin.route('/').get(wxAuth);

    app.use('/', weixin);
};