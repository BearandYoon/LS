import mongoose, { Schema } from 'mongoose';
import P from 'bluebird';
import timestamps from 'mongoose-timestamp';
import update from 'mongoose-model-update';


/**
 * File Schema
 */

let SuccessRate = new Schema ({
    user:{
        type: Schema.ObjectId,
        ref:'User',
        required: 'Event host cannot be blank. '
    },
    input1: {
        type: String,
        required: true
    },
    input2: {
        type: String,
        required: true
    },
    success: {
        type: Number,
        default: 0
    },
    count: {
        type: Number,
        default: 1
    }
});

SuccessRate.plugin(timestamps);
//File.plugin(update, ['user', 'version_id', 'file']);

SuccessRate.statics.saveResult = async function(myinputs, success) {
    let existing = await this.findOneAsync(myinputs);
    console.log(existing);
    if(!existing) {
        if(success) myinputs.success = 1;
        await new this(myinputs).saveAsync();
        return true;
    }
    else{
        existing.count ++;
        if(success) existing.success ++;
        await existing.saveAsync();
        return true;
    }
};

SuccessRate.statics.getInput1Prediction = async function(input1){
    let predictions = await this.findAsync( {"input1" : {"$regex": input1, "$options":"i"}});
    return predictions;
};

module.exports = mongoose.model('SuccessRate', SuccessRate);
P.promisifyAll(module.exports);
P.promisifyAll(module.exports.prototype);
