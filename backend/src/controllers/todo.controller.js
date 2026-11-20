const todoModel = require("../models/todo.model");
const subjectModel = require("../models/subject.model");

const STATUSES = ["pending", "completed"];
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

// Normaliza la fecha: "" o null -> null; valida formato YYYY-MM-DD
const parseDueDate = (value) => {
    if (value === undefined || value === null || value === "") return { value: null };
    if (!DATE_REGEX.test(value)) return { error: "La fecha debe tener formato YYYY-MM-DD" };
    return { value };
};

const getTodos = async (req, res) => {
    try {
        const userId = req.user.id;
        const { subjectId } = req.params;

        if (!(await subjectModel.subjectBelongsToUser(userId, subjectId))) {
            return res.status(404).json({ message: "Materia no encontrada" });
        }

        const todos = await todoModel.getTodosBySubject(userId, subjectId);
        res.status(200).json(todos);
    } catch (error) {
        console.error("Error en getTodos", error);
        res.status(500).json({ message: "Error al obtener las tareas" });
    }
};

// Todas las tareas del usuario (página global de To-Do List)
const getAllTodos = async (req, res) => {
    try {
        const userId = req.user.id;
        const todos = await todoModel.getTodosByUser(userId);
        res.status(200).json(todos);
    } catch (error) {
        console.error("Error en getAllTodos", error);
        res.status(500).json({ message: "Error al obtener las tareas" });
    }
};

// La materia viene en la URL (/subjects/:subjectId/todos) o en el body
// (/todos, subject_id opcional: sin materia la tarea es general)
const createTodo = async (req, res) => {
    try {
        const userId = req.user.id;
        const rawSubjectId = req.params.subjectId ?? req.body.subject_id;
        const subjectId = rawSubjectId === undefined || rawSubjectId === null || rawSubjectId === ""
            ? null
            : rawSubjectId;
        const title = (req.body.title || "").trim();

        if (!title) {
            return res.status(400).json({ message: "El título de la tarea es obligatorio" });
        }

        const dueDate = parseDueDate(req.body.due_date);
        if (dueDate.error) {
            return res.status(400).json({ message: dueDate.error });
        }

        if (subjectId !== null && !(await subjectModel.subjectBelongsToUser(userId, subjectId))) {
            return res.status(404).json({ message: "Materia no encontrada" });
        }

        const todoId = await todoModel.addTodo(userId, subjectId, {
            title,
            description: req.body.description || null,
            due_date: dueDate.value
        });
        const todo = await todoModel.getTodoById(userId, todoId);

        res.status(201).json(todo);
    } catch (error) {
        console.error("Error en createTodo", error);
        res.status(500).json({ message: "Error al crear la tarea" });
    }
};

// Actualización parcial (p. ej. solo { status: "completed" })
const updateTodo = async (req, res) => {
    try {
        const userId = req.user.id;
        const { todoId } = req.params;
        const body = req.body;

        const current = await todoModel.getTodoById(userId, todoId);
        if (!current) {
            return res.status(404).json({ message: "Tarea no encontrada" });
        }

        const title = "title" in body ? (body.title || "").trim() : current.title;
        if (!title) {
            return res.status(400).json({ message: "El título de la tarea es obligatorio" });
        }

        const status = "status" in body ? body.status : current.status;
        if (!STATUSES.includes(status)) {
            return res.status(400).json({ message: "Estado inválido (pending o completed)" });
        }

        let dueDate = current.due_date;
        if ("due_date" in body) {
            const parsed = parseDueDate(body.due_date);
            if (parsed.error) {
                return res.status(400).json({ message: parsed.error });
            }
            dueDate = parsed.value;
        }

        await todoModel.updateTodo(userId, todoId, {
            title,
            description: "description" in body ? body.description || null : current.description,
            due_date: dueDate,
            status
        });
        const todo = await todoModel.getTodoById(userId, todoId);

        res.status(200).json(todo);
    } catch (error) {
        console.error("Error en updateTodo", error);
        res.status(500).json({ message: "Error al actualizar la tarea" });
    }
};

const deleteTodo = async (req, res) => {
    try {
        const userId = req.user.id;
        const { todoId } = req.params;

        const affected = await todoModel.deleteTodo(userId, todoId);
        if (!affected) {
            return res.status(404).json({ message: "Tarea no encontrada" });
        }

        res.status(200).json({ message: "Tarea eliminada" });
    } catch (error) {
        console.error("Error en deleteTodo", error);
        res.status(500).json({ message: "Error al eliminar la tarea" });
    }
};

module.exports = { getTodos, getAllTodos, createTodo, updateTodo, deleteTodo };
