const { pool } = require("../config/db");

// due_date se formatea en SQL para evitar desfases de zona horaria al serializar.
// subject_id puede ser NULL (tarea sin materia), por eso los JOIN son LEFT.
const TODO_SELECT = `SELECT
        T.id,
        T.subject_id,
        T.title,
        T.description,
        DATE_FORMAT(T.due_date, '%Y-%m-%d') AS due_date,
        T.status,
        T.created_at,
        Sb.name AS subject_name,
        Sb.color AS subject_color,
        S.id AS semester_id,
        S.name AS semester_name
    FROM todos T
    LEFT JOIN subjects Sb ON T.subject_id = Sb.id
    LEFT JOIN semesters S ON Sb.semester_id = S.id`;

const TODO_ORDER = `ORDER BY T.status = 'completed', T.due_date IS NULL, T.due_date, T.created_at DESC`;

const getTodosBySubject = async (userId, subjectId) => {
    const query = `${TODO_SELECT}
        WHERE T.user_id = ? AND T.subject_id = ?
        ${TODO_ORDER}`;

    const [rows] = await pool.execute(query, [userId, subjectId]);
    return rows;
};

// Todas las tareas del usuario, de todas las materias (y sin materia)
const getTodosByUser = async (userId) => {
    const query = `${TODO_SELECT}
        WHERE T.user_id = ?
        ${TODO_ORDER}`;

    const [rows] = await pool.execute(query, [userId]);
    return rows;
};

const getTodoById = async (userId, todoId) => {
    const query = `${TODO_SELECT} WHERE T.user_id = ? AND T.id = ?`;
    const [rows] = await pool.execute(query, [userId, todoId]);
    return rows[0];
};

// subjectId puede ser null para una tarea general
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

module.exports = { getTodosBySubject, getTodosByUser, getTodoById, addTodo, updateTodo, deleteTodo };
