const subjectModel = require("../models/subject.model");

const getSubjects = async (req, res) => {
    try{
        const userId = req.user.id;
        const { semesterId } = req.params;

        const subjects = await subjectModel.getSubjects(userId, semesterId);
        res.json(subjects);
    }catch(error){

    }
}