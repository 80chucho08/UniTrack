const { pool } = require("../config/db");

// value y weight son DECIMAL: se convierten a número en SQL (mysql2 los devuelve como string)
const GRADE_FIELDS = `id, subject_id, name,
    CAST(value AS DOUBLE) AS value,
    CAST(weight AS DOUBLE) AS weight,
    DATE_FORMAT(date, '%Y-%m-%d') AS date,
    created_at`;

const getGradesBySubject = async (userId, subjectId) => {
    const query = `SELECT ${GRADE_FIELDS}
        FROM grades
        WHERE user_id = ? AND subject_id = ?
        ORDER BY date IS NULL, date, created_at`;

    const [rows] = await pool.execute(query, [userId, subjectId]);
    return rows;
};

const getGradeById = async (userId, gradeId) => {
    const query = `SELECT ${GRADE_FIELDS} FROM grades WHERE user_id = ? AND id = ?`;
    const [rows] = await pool.execute(query, [userId, gradeId]);
    return rows[0];
};

const addGrade = async (userId, subjectId, gradeData) => {
    const { name, value, weight, date = null } = gradeData;
    const query = `INSERT INTO grades (user_id, subject_id, name, value, weight, date)
        VALUES (?, ?, ?, ?, ?, ?)`;
    const [result] = await pool.execute(query, [userId, subjectId, name, value, weight, date]);
    return result.insertId;
};

const updateGrade = async (userId, gradeId, gradeData) => {
    const { name, value, weight, date } = gradeData;
    const query = `UPDATE grades SET name = ?, value = ?, weight = ?, date = ?
        WHERE id = ? AND user_id = ?`;
    const [result] = await pool.execute(query, [name, value, weight, date, gradeId, userId]);
    return result.affectedRows;
};

const deleteGrade = async (userId, gradeId) => {
    const query = `DELETE FROM grades WHERE id = ? AND user_id = ?`;
    const [result] = await pool.execute(query, [gradeId, userId]);
    return result.affectedRows;
};

module.exports = { getGradesBySubject, getGradeById, addGrade, updateGrade, deleteGrade };
