//var mongoose = require ('mongoose'),
//    User = mongoose.model('User')
let jwt    = require('jsonwebtoken');
let env = process.env.NODE_ENV || 'development';
let config = require('../../config/config')[env];
import { SuccessRate } from '../models';

async function save(req, res, next){

    let {input1, input2, success} = req.body;
    let user = req.user._id;
    let myinputs = {input1: input1, input2: input2, user:user};
    await SuccessRate.saveResult(myinputs, success);
    res.success({});

}

async function predictInputOne(req, res, next){
    let {input1} = req.params;
    let response = await SuccessRate.getInput1Prediction(input1);
    res.success({predictions: response});
}

async function index(req, res, next){
    let user = req.user._id;
    let response = await SuccessRate.findAsync({user:user});
    res.success({data: response});
}

module.exports = {
    save: save,
    index: index,
    predictInputOne: predictInputOne
};
