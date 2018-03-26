

module.exports = function(app, express, controllers) {
    let auth = express.Router();
    // app.post('/testUser',controllers.user.authenticate);

    auth.route('/wechaAuth').get(controllers.auth.auth);

    app.use('/wechaAuth', auth);
};