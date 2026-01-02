const subjectModel = require("../models/subject.model");

const getSubjects = async (req, res) => {
    try {
        const userId = req.user.id;
        const { semesterId } = req.params;

        if (!userId || !semesterId) {
            return res.status(400).json({
                message: "El id del usuario o el id de semestre es requerido"
            });
        }

        const subjects = await subjectModel.getSubjects(userId, semesterId);
        res.json(subjects);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener materias" });
    }
}

const createSubject = async (req, res) => {
    try {
        const userId = req.user.id;
        const { semesterId } = req.params;
        if (!userId || !semesterId) {
            return res.status(400).json({
                message: "El id del usuario o el id de semestre es requerido"
            });
        }
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: "El nombre de la materia es obligatorio" });
        }

        const subjectId = await subjectModel.addSubject(
            userId,
            semesterId,
            req.body
        );

        res.status(201).json({
            message: "Materia creada correctamente",
            subjectId
        });
    } catch (error) {
        res.status(500).json({ message: "Error al crear materia" });
    }
}

module.exports = { getSubjects, createSubject };