
const wxAuth = require('../app/libs/wxAuth');


module.exports = function(app, express, controllers) {
    let weixin = express.Router();

    weixin.route('/').post(controllers.weixin.weixin);
    // weixin.route('/').get(wxAuth);

    // app.use('/', weixin);
};