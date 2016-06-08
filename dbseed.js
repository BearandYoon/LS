var mongoose = require ('mongoose');
var fs = require('fs');
var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/../../config/config')[env];
var faker = require('Faker');
var mongoose = require('mongoose');
var models_path = __dirname + '/api/models';

mongoose.connect(config.db);


fs.readdirSync(models_path).forEach(function (file) {
    require(models_path+'/'+file);
});
