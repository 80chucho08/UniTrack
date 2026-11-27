const gradeModel = require("../models/grade.model");
const subjectModel = require("../models/subject.model");

// Los bodies llegan validados por validators/schemas.js (createGrade / updateGrade)

const getGrades = async (req, res) => {
    try {
        const userId = req.user.id;
        const { subjectId } = req.params;

        if (!(await subjectModel.subjectBelongsToUser(userId, subjectId))) {
            return res.status(404).json({ message: "Materia no encontrada" });
        }

        const grades = await gradeModel.getGradesBySubject(userId, subjectId);
        res.status(200).json(grades);
    } catch (error) {
        console.error("Error en getGrades", error);
        res.status(500).json({ message: "Error al obtener las calificaciones" });
    }
};

const createGrade = async (req, res) => {
    try {
        const userId = req.user.id;
        const { subjectId } = req.params;

        if (!(await subjectModel.subjectBelongsToUser(userId, subjectId))) {
            return res.status(404).json({ message: "Materia no encontrada" });
        }

        const gradeId = await gradeModel.addGrade(userId, subjectId, req.body);
        const grade = await gradeModel.getGradeById(userId, gradeId);

        res.status(201).json(grade);
    } catch (error) {
        console.error("Error en createGrade", error);
        res.status(500).json({ message: "Error al registrar la calificación" });
    }
};

// Actualización parcial: los campos ausentes conservan su valor
const updateGrade = async (req, res) => {
    try {
        const userId = req.user.id;
        const { gradeId } = req.params;

        const current = await gradeModel.getGradeById(userId, gradeId);
        if (!current) {
            return res.status(404).json({ message: "Calificación no encontrada" });
        }

        // Edición parcial: lo que no viene en el body conserva su valor
        const { name, value, weight, date } = current;
        await gradeModel.updateGrade(userId, gradeId, { name, value, weight, date, ...req.body });
        const grade = await gradeModel.getGradeById(userId, gradeId);

        res.status(200).json(grade);
    } catch (error) {
        console.error("Error en updateGrade", error);
        res.status(500).json({ message: "Error al actualizar la calificación" });
    }
};

const deleteGrade = async (req, res) => {
    try {
        const userId = req.user.id;
        const { gradeId } = req.params;

        const affected = await gradeModel.deleteGrade(userId, gradeId);
        if (!affected) {
            return res.status(404).json({ message: "Calificación no encontrada" });
        }

        res.status(200).json({ message: "Calificación eliminada" });
    } catch (error) {
        console.error("Error en deleteGrade", error);
        res.status(500).json({ message: "Error al eliminar la calificación" });
    }
};

module.exports = { getGrades, createGrade, updateGrade, deleteGrade };
