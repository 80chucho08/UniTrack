const todoModel = require("../models/todo.model");
const subjectModel = require("../models/subject.model");

// Los bodies llegan validados por validators/schemas.js (createTodo / updateTodo)

const getTodos = async (req, res) => {
    const userId = req.user.id;
    const { subjectId } = req.params;

    if (!(await subjectModel.subjectBelongsToUser(userId, subjectId))) {
        return res.status(404).json({ message: "Materia no encontrada" });
    }

    const todos = await todoModel.getTodosBySubject(userId, subjectId);
    res.status(200).json(todos);
};

// Todas las tareas del usuario (página global de To-Do List)
const getAllTodos = async (req, res) => {
    const userId = req.user.id;
    const todos = await todoModel.getTodosByUser(userId);
    res.status(200).json(todos);
};

// La materia viene en la URL (/subjects/:subjectId/todos) o en el body
// (/todos, subject_id opcional: sin materia la tarea es general)
const createTodo = async (req, res) => {
    const userId = req.user.id;
    const subjectId = req.params.subjectId ?? req.body.subject_id ?? null;
    const { title, description = null, due_date = null } = req.body;

    if (subjectId !== null && !(await subjectModel.subjectBelongsToUser(userId, subjectId))) {
        return res.status(404).json({ message: "Materia no encontrada" });
    }

    const todoId = await todoModel.addTodo(userId, subjectId, {
        title,
        description,
        due_date
    });
    const todo = await todoModel.getTodoById(userId, todoId);

    res.status(201).json(todo);
};

// Actualización parcial (p. ej. solo { status: "completed" })
const updateTodo = async (req, res) => {
    const userId = req.user.id;
    const { todoId } = req.params;
    const body = req.body;

    const current = await todoModel.getTodoById(userId, todoId);
    if (!current) {
        return res.status(404).json({ message: "Tarea no encontrada" });
    }

    // Edición parcial (p. ej. solo { status }): lo que no viene se conserva
    const pick = (field) => (field in body ? body[field] : current[field]);

    await todoModel.updateTodo(userId, todoId, {
        title: pick("title"),
        description: pick("description"),
        due_date: pick("due_date"),
        status: pick("status")
    });
    const todo = await todoModel.getTodoById(userId, todoId);

    res.status(200).json(todo);
};

const deleteTodo = async (req, res) => {
    const userId = req.user.id;
    const { todoId } = req.params;

    const affected = await todoModel.deleteTodo(userId, todoId);
    if (!affected) {
        return res.status(404).json({ message: "Tarea no encontrada" });
    }

    res.status(200).json({ message: "Tarea eliminada" });
};

module.exports = { getTodos, getAllTodos, createTodo, updateTodo, deleteTodo };
