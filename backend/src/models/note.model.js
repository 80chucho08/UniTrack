const { pool } = require("../config/db");

const getNotesBySubject = async (userId, subjectId) => {
    const query = `SELECT id, subject_id, title, content, created_at, updated_at
        FROM notes
        WHERE user_id = ? AND subject_id = ?
        ORDER BY updated_at DESC`;

    const [rows] = await pool.execute(query, [userId, subjectId]);
    return rows;
};

const getNoteById = async (userId, noteId) => {
    const query = `SELECT id, subject_id, title, content, created_at, updated_at
        FROM notes
        WHERE user_id = ? AND id = ?`;

    const [rows] = await pool.execute(query, [userId, noteId]);
    return rows[0];
};

const addNote = async (userId, subjectId, title, content) => {
    const query = `INSERT INTO notes (user_id, subject_id, title, content) VALUES (?, ?, ?, ?)`;
    const [result] = await pool.execute(query, [userId, subjectId, title, content]);
    return result.insertId;
};

const updateNote = async (userId, noteId, title, content) => {
    const query = `UPDATE notes SET title = ?, content = ? WHERE id = ? AND user_id = ?`;
    const [result] = await pool.execute(query, [title, content, noteId, userId]);
    return result.affectedRows;
};

const deleteNote = async (userId, noteId) => {
    const query = `DELETE FROM notes WHERE id = ? AND user_id = ?`;
    const [result] = await pool.execute(query, [noteId, userId]);
    return result.affectedRows;
};

module.exports = { getNotesBySubject, getNoteById, addNote, updateNote, deleteNote };
