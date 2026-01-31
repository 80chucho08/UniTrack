const scheduleModel = require("../models/schedule.model");

const getSubjectsBySemester = async (req, res) => {
    try {
        const userId = req.user.id;
        const { semesterId } = req.params;

        if (!userId || !semesterId) {
            return res.status(400).json({
                message: "El id o el id de semester es requerido"
            });
        }

        const subjects = await scheduleModel.getSubjectsBySemester(userId, semesterId);
        res.json(subjects);
    } catch (error) {
        console.error("Error detallado:", error);
        res.status(500).json({
            message: "Error al obtener materias",
            error: error.message //ver problema en Thunder Client
        });
    }
}


// Guardar una materia en el grid (al soltar/asignar en el frontend)
const saveScheduleSubject = async (req, res) => {
    try {
        const userId = req.user.id;
        const { subject_id, day, start_time, end_time, classroom } = req.body;

        // Validación básica
        if (!subject_id || !day || !start_time) {
            return res.status(400).json({ message: "Faltan datos obligatorios para el horario" });
        }

        const result = await scheduleModel.saveScheduleSubject({
            user_id: userId,
            subject_id,
            day,
            start_time,
            end_time,
            classroom
        });

        res.status(201).json({
            message: "Materia asignada al horario con éxito",
            insertedId: result.insertId
        });
    } catch (error) {
        console.error("Error al guardar en horario:", error);
        res.status(500).json({ message: "Error al guardar la materia", error: error.message });
    }
}

const getSchedule = async (req, res) => {
    try {
        const userId = req.user.id;
        const schedule = await scheduleModel.getScheduleSubjects(userId);
        res.json(schedule);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el horario", error: error.message });
    }
}

const deleteScheduleSubject = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params; // ID de la fila en la tabla schedule

        const result = await scheduleModel.deleteScheduleSubject(userId, id);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "No se encontró el registro o no tienes permiso" });
        }

        res.json({ message: "Materia eliminada del horario" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar la materia", error: error.message });
    }
}

module.exports = { getSubjectsBySemester, saveScheduleSubject, getSchedule, deleteScheduleSubject };