const semesterModel = require("../models/semester.model");

const getSemesters = async (req, res) => {
    try{
        const {userId} = req.params;

        if (!userId) {
            return res.status(400).json({
                message: "El id del usuairo es requerido"
            });
        }

        const semesters = await semesterModel.getSemestersByUser(userId);

        res.status(200).json(semesters);
    }catch (error){
        console.error("Error en get semesters", error);
        res.status(500).json({ message: "Error al obtener los semestres" });
    }
};

const createSemester = async (req, res) => {
    try{
        const {userId, name} = req.body;

        if(!userId || !name){
            return res.status(400).json({
                message: "Faltan datos obliagtorios (userId o name)"
            });
        }

        const insertId = await semesterModel.AddSemester(userId, name);

        res.staut(201).json({
            message: "Semestre creado con exito",
            semesterId: insertId
        });

    }catch(error){
        console.error("Error en createSemester", error);
        res.status(500).json({ message: "Error al crear el semestre" });
    }
}



module.exports = { getSemesters, createSemester };