const ContestModel = require('../models/ContestModel');

const createContest = async (req,res) => {
    try{
        const { contestName, description, startDate, endDate, problems } = req.body;
        const newContest = new ContestModel({ contestName, description, startDate, endDate, problems });
        await newContest.save();
        res.status(201).json({success: true, contest : newContest});
    }
    catch(error){
        res.status(500).json({ success: false, message: error.message });
    }
};

const getContest = async (req,res) => {
    try {
        const contest = await ContestModel.find().populate('problems');
        res.status(200).json({ success: true, contest });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getContestById = async (req,res) => {
    try {
        const contest = await ContestModel.findById(req.params.id).populate('problems');
        if (!contest) {
            return res.status(404).json({ success: false, message: 'Contest not found' });
        }
        res.status(200).json({ success: true, contest });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateContest = async (req,res) => {
    try {
        const updatedContest = await ContestModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedContest) {
            return res.status(404).json({ success: false, message: 'Contest not found' });
        }
        res.status(200).json({ success: true, contest: updatedContest });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const deleteContest = async (req,res) => {
    try {
        const deletedContest = await ContestModel.findByIdAndDelete(req.params.id);
        if (!deletedContest) {
            return res.status(404).json({ success: false, message: 'Contest not found' });
        }
        res.status(200).json({ success: true, message: 'contest Deleted Successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = {
    createContest,
    getContest,
    getContestById,
    updateContest,
    deleteContest
}