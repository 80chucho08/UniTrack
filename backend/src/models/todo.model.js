const { pool } = require("../config/db");

// due_date se formatea en SQL para evitar desfases de zona horaria al serializar
const TODO_FIELDS = `id, subject_id, title, description,
    DATE_FORMAT(due_date, '%Y-%m-%d') AS due_date,
    status, created_at`;

const getTodosBySubject = async (userId, subjectId) => {
    const query = `SELECT ${TODO_FIELDS}
        FROM todos
        WHERE user_id = ? AND subject_id = ?
        ORDER BY status = 'completed', due_date IS NULL, due_date, created_at DESC`;

    const [rows] = await pool.execute(query, [userId, subjectId]);
    return rows;
};

const getTodoById = async (userId, todoId) => {
    const query = `SELECT ${TODO_FIELDS} FROM todos WHERE user_id = ? AND id = ?`;
    const [rows] = await pool.execute(query, [userId, todoId]);
    return rows[0];
};

const addTodo = async (userId, subjectId, todoData) => {
    const { title, description = null, due_date = null } = todoData;
    const query = `INSERT INTO todos (user_id, subject_id, title, description, due_date)
        VALUES (?, ?, ?, ?, ?)`;
    const [result] = await pool.execute(query, [userId, subjectId, title, description, due_date]);
    return result.insertId;
};

const updateTodo = async (userId, todoId, todoData) => {
    const { title, description, due_date, status } = todoData;
    const query = `UPDATE todos SET title = ?, description = ?, due_date = ?, status = ?
        WHERE id = ? AND user_id = ?`;
    const [result] = await pool.execute(query, [title, description, due_date, status, todoId, userId]);
    return result.affectedRows;
};

const deleteTodo = async (userId, todoId) => {
    const query = `DELETE FROM todos WHERE id = ? AND user_id = ?`;
    const [result] = await pool.execute(query, [todoId, userId]);
    return result.affectedRows;
};

module.exports = { getTodosBySubject, getTodoById, addTodo, updateTodo, deleteTodo };
