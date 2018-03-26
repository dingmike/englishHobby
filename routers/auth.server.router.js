

module.exports = function(app, express, controllers) {
    let auth = express.Router();
    // app.post('/testUser',controllers.user.authenticate);

    auth.route('/wechatAuth').get(controllers.auth.auth);

    app.use('/wechat', auth);
};