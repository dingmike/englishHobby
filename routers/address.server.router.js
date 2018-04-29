const jwtAuth = require('../app/libs/jwt');


module.exports = function(app, express, controllers) {
  let address = express.Router();
     // app.post('/testUser',controllers.user.authenticate);

    address.route('/delete').post(controllers.address.delete);
    address.route('/test')
            .post(jwtAuth.getTokenAndVertify, controllers.user.authenticate); // 验证token失效
    address.route('/add')
            .post(controllers.address.add)
            .put(controllers.user.UserAccess(false),controllers.user.edit);
    address.route('/:username')
            .get(controllers.user.get);
    app.use('/address', address);
};