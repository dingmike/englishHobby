const jwtAuth = require('../app/libs/jwt');


module.exports = function(app, express, controllers) {
  let shop = express.Router();
     // app.post('/testUser',controllers.user.authenticate);

    shop.route('/getValue').post(controllers.shop.getValue)
        .get(controllers.shop.getValue);
    shop.route('/setValue').post(controllers.shop.setValue);

    app.use('/shop', shop);
};