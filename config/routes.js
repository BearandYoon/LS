import tokenCtrl from '../api/controllers/token';
import usersCtrl from '../api/controllers/users';
import successrateCtrl from '../api/controllers/successrate';

import resError from '../api/middlewares/res_error';
import resSuccess from '../api/middlewares/res_success';
import modelMagic from '../api/middlewares/model_magic';
var multer = require('multer');

let env = process.env.NODE_ENV || 'development';

var avatarUpload = multer({
    dest: './uploads/avatar',
    rename: function (fieldname, filename) {
        return filename + Date.now();
    }
});

module.exports = function ( app, passport ){

    app.use(resError);
    app.use(resSuccess);

    app.post('/api/auth/login', usersCtrl.Login);
    app.post('/api/auth/register', usersCtrl.SignUp);
    app.post('/api/auth/logout', tokenCtrl.ensureAuthenticated, usersCtrl.Logout);
    app.delete('/api/auth/delete', tokenCtrl.ensureAuthenticated, usersCtrl.UserDelete);

    app.get('/api/me', tokenCtrl.ensureAuthenticated, usersCtrl.getProfile);
    app.put('/api/me', tokenCtrl.ensureAuthenticated, usersCtrl.updateProfile);
};