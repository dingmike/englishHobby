
module.exports = function(app, express, controllers) {
    let userinfo = express.Router();
    // app.post('/testUser',controllers.user.authenticate);

    userinfo.route('/userinfo').get(controllers.userinfo.userinfo);

    app.use('/userinfo', userinfo);
};