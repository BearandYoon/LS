import database from './config/database';
var express = require('express');
var fs = require('fs');
var passport = require('passport');
var morgan = require('morgan');
var logger = require('./api/common/log');
var cors = require('cors');
var bodyParser = require('body-parser');

//var models_path = __dirname + '/api/models';

var env = process.env.NODE_ENV || 'development';
console.log(env);
var config = require('./config/config')[env];
var app = express();


app.set('superSecret', config.secret);
app.use(morgan('short', {
    stream: logger.asStream('info')
}));

app.use(express.static('./public'));

app.use(cors());
// Bootstrap db connection

//fs.readdirSync(models_path).forEach(function (file) {
//    require(models_path+'/'+file);
//});

// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
    res.set('X-Powered-By', 'TemptationGame');
    next();
});

require('./config/routes')(app, passport);

app.use(function (err, req, res, next){
    if(err){
        console.log(err);
        if(typeof err.status != "undefined")   res.status(err.status);
        res.send(err);
    }
});

app.get('*', function(req, res) {
    res.sendfile('./public/index.html');
});

app.listen(process.env.PORT || 3000);

if (process.env.PORT === undefined) {
    console.log("Server Started at port : " + 3000);
}
else {
    console.log("Server Started at port : " + process.env.PORT);
}
