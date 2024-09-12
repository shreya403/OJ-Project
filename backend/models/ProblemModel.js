const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
    problemName : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    difficulty : {
        type : String,
        required : true
    },
    submissions : {
        type : Number,
        required : true
    },
    marks : {
        type : Number,
        required : true
    },
    author : {
        type : String,
        required : true
    },
    constraints : {
        type : String,
        required : true
    },
    inputFormat : {
        type : String,
        required : true
    },
    outputFormat : {
        type : String,
        required : true
    },
    sampleInput : {
        type : String,
        required : true
    },
    sampleOutput : {
        type : String,
        required : true
    },
    explanation : {
        type : String
    },
    hiddenTestCases : [{
        input : String,
        expectedOutput : String
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
problemSchema.methods.toJSON = function() {
    const obj = this.toObject();
    delete obj.hiddenTestCases;
    return obj;
};

module.exports = mongoose.model('problem',problemSchema);