const { pool } = require("../config/db");

const getSubjects = async (userId, semesterId) => {
    const query = `
        SELECT 
            Sb.id, 
            Sb.user_id, 
            Sb.semester_id, 
            Sb.name
        FROM subjects Sb
        INNER JOIN semesters S ON Sb.semester_id = S.id
        WHERE Sb.user_id = ? AND Sb.semester_id = ?
    `;

    const [rows] = await pool.execute(query, [userId, semesterId]);

    return rows;
}


const addSubject = async (userId, semesterId, subjectId) => {
    const query = (``);

    const [result] = await pool.execute(query, []);

    return result.insertId;

}

module.exports = { getSubjects, addSubject };