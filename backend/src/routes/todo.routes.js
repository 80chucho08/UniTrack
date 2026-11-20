const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const todoController = require("../controllers/todo.controller");

// Este router se monta en /api (ver app.js)

// tareas de una materia
router.get("/subjects/:subjectId/todos", authMiddleware, todoController.getTodos);
router.post("/subjects/:subjectId/todos", authMiddleware, todoController.createTodo);

// todas las tareas del usuario y alta desde la página global (subject_id opcional)
router.get("/todos", authMiddleware, todoController.getAllTodos);
router.post("/todos", authMiddleware, todoController.createTodo);

// editar (incluye marcar como completada) y borrar una tarea
router.put("/todos/:todoId", authMiddleware, todoController.updateTodo);
router.delete("/todos/:todoId", authMiddleware, todoController.deleteTodo);

module.exports = router;
