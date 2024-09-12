const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const submissionSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    problemId: { type: Schema.Types.ObjectId, ref: 'problem', required: true },
    code: { type: String, required: true },
    language: { type: String, required: true },
    result: { type: String, required: true },
    
},{timestamps:true});

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;
