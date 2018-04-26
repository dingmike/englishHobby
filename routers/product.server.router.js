const jwtAuth = require('../app/libs/jwt');


module.exports = function(app, express, controllers) {
  let product = express.Router();
     // app.post('/testUser',controllers.user.authenticate);

    product.route('/add')
            .post(controllers.product.add);
    product.route('/get')
            .get(controllers.product.get);
    product.route('/getList')
        .post(controllers.product.getList);
    product.route('/edit')
        .post(controllers.product.edit);
    product.route('/signin')
            .post(controllers.user.signin)
            .put(controllers.user.UserAccess(false),controllers.product.edit);
    product.route('/:username')
            .get(controllers.user.get);
    app.use('/product', product);
};