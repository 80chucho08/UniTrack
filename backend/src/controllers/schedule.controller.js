const scheduleModel = require("../models/schedule.model");
const subjectModel = require("../models/subject.model");

const getSubjectsBySemester = async (req, res) => {
    try {
        const userId = req.user.id;
        const { semesterId } = req.params;

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
        // req.body validado por schemas.createScheduleEntry
        const { subject_id, day, start_time, end_time = null, classroom = null } = req.body;

        // Autorización: solo se puede poner en el horario una materia propia
        if (!(await subjectModel.subjectBelongsToUser(userId, subject_id))) {
            return res.status(404).json({ message: "Materia no encontrada" });
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

// Clases asignadas a una materia (para el dashboard de la materia)
const getScheduleBySubject = async (req, res) => {
    try {
        const userId = req.user.id;
        const { subjectId } = req.params;

        const rows = await scheduleModel.getScheduleBySubject(userId, subjectId);
        res.status(200).json(rows);
    } catch (error) {
        console.error("Error en getScheduleBySubject", error);
        res.status(500).json({ message: "Error al obtener el horario de la materia" });
    }
}

module.exports = { getSubjectsBySemester, saveScheduleSubject, getSchedule, deleteScheduleSubject, getScheduleBySubject };