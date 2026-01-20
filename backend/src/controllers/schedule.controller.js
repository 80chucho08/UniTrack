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
        console.error("Error detallado:", error); // Esto aparecerá en tu terminal/VS Code
        res.status(500).json({
            message: "Error al obtener materias",
            error: error.message // Esto te ayudará a ver el problema en Thunder Client
        });
    }
}

module.exports = { getSubjectsBySemester };