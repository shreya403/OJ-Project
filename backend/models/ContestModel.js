const mongoose = require('mongoose');

const contestSchema = new mongoose.Schema({
    contestName : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    startDate : {
        type : Date,
        required : true
    },
    endDate : {
        type : Date,
        required : true
    },
    problems : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'problem',
    }]
});

const ContestModel = mongoose.model('contest', contestSchema);
module.exports = ContestModel;