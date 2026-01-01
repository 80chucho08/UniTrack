const { pool } = require("../config/db");

const getSubjects = async (userId, semesterId) => {
    const query = `SELECT 
            Sb.id, 
            Sb.user_id, 
            Sb.semester_id, 
            Sb.name
        FROM subjects Sb
        INNER JOIN semesters S ON Sb.semester_id = S.id
        WHERE Sb.user_id = ? AND Sb.semester_id = ?`;

    const [rows] = await pool.execute(query, [userId, semesterId]);

    return rows;
}


const addSubject = async (userId, semesterId, subjectData) => {
    // Desestructuramos los datos del objeto subjectData
    const {
        name,
        teacher_name = null,
        teacher_email = null,
        credits = null,
        color = null,
        evaluation_criteria = null
    } = subjectData;

    const query = `
        INSERT INTO subjects (
            user_id, 
            semester_id, 
            name, 
            teacher_name, 
            teacher_email, 
            credits, 
            color, 
            evaluation_criteria
        ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        userId,
        semesterId,
        name,
        teacher_name,
        teacher_email,
        credits,
        color,
        evaluation_criteria
    ];

    const [result] = await pool.execute(query, values);

    // Retornamos el ID de la materia recién creada
    return result.insertId;
};


module.exports = { getSubjects, addSubject };