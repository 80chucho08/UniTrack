const semesterModel = require("../models/semester.model");

const getSemesters = async (req, res) => {
    const userId = req.user.id;
    const semesters = await semesterModel.getSemestersByUser(userId);

    res.status(200).json(semesters);
};

const createSemester = async (req, res) => {
    const userId = req.user.id;
    const { name, period } = req.body; // validado por schemas.createSemester

    const insertId = await semesterModel.AddSemester(userId, name, period);

    res.status(201).json({
        message: "Semestre creado con exito",
        semesterId: insertId
    });

}



module.exports = { getSemesters, createSemester };