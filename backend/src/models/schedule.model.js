const { pool } = require("../config/db");

const getSubjectsBySemester = async (userId, semesterId) => {
    const query = `SELECT 
            Sb.id, 
            Sb.user_id, 
            Sb.semester_id, 
            Sb.name,
            Sb.color
        FROM subjects Sb
        INNER JOIN semesters S ON Sb.semester_id = S.id
        WHERE Sb.user_id = ? AND Sb.semester_id = ?`;

    const [rows] = await pool.execute(query, [userId, semesterId]);

    return rows;
}

const saveScheduleSubject = async () => {
    const query = ``;
    
}

const deleteScheduleSubject = async () => {
    const query = ``;
}

const getScheduleSubjects = async () => {
    const query = ``;
}


module.exports = { getSubjectsBySemester };