const gradeModel = require("../models/grade.model");
const subjectModel = require("../models/subject.model");

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

// Valida y normaliza los campos de una calificación. Devuelve { data } o { error }.
const validateGrade = ({ name, value, weight, date }) => {
    const cleanName = (name || "").trim();
    if (!cleanName) return { error: "El nombre de la evaluación es obligatorio" };

    const numValue = Number(value);
    if (value === "" || value === null || value === undefined || !Number.isFinite(numValue) || numValue < 0 || numValue > 100) {
        return { error: "La calificación debe ser un número entre 0 y 100" };
    }

    const numWeight = Number(weight);
    if (weight === "" || weight === null || weight === undefined || !Number.isFinite(numWeight) || numWeight < 0 || numWeight > 100) {
        return { error: "El porcentaje debe ser un número entre 0 y 100" };
    }

    const cleanDate = date === undefined || date === null || date === "" ? null : date;
    if (cleanDate !== null && !DATE_REGEX.test(cleanDate)) {
        return { error: "La fecha debe tener formato YYYY-MM-DD" };
    }

    return { data: { name: cleanName, value: numValue, weight: numWeight, date: cleanDate } };
};

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

        const { data, error } = validateGrade(req.body);
        if (error) {
            return res.status(400).json({ message: error });
        }

        if (!(await subjectModel.subjectBelongsToUser(userId, subjectId))) {
            return res.status(404).json({ message: "Materia no encontrada" });
        }

        const gradeId = await gradeModel.addGrade(userId, subjectId, data);
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

        const { data, error } = validateGrade({ ...current, ...req.body });
        if (error) {
            return res.status(400).json({ message: error });
        }

        await gradeModel.updateGrade(userId, gradeId, data);
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
