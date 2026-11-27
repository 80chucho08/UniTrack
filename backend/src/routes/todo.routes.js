const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const todoController = require("../controllers/todo.controller");
const validate = require("../middlewares/validate.middleware");
const schemas = require("../validators/schemas");
const { idParams } = require("../validators/common");

const subjectParams = idParams("subjectId", "id de materia");
const todoParams = idParams("todoId", "id de tarea");

// Este router se monta en /api (ver app.js)

// tareas de una materia
router.get("/subjects/:subjectId/todos", authMiddleware, validate({ params: subjectParams }), todoController.getTodos);
router.post("/subjects/:subjectId/todos", authMiddleware, validate({ params: subjectParams, body: schemas.createTodo }), todoController.createTodo);

// todas las tareas del usuario y alta desde la página global (subject_id opcional)
router.get("/todos", authMiddleware, todoController.getAllTodos);
router.post("/todos", authMiddleware, validate({ body: schemas.createTodo }), todoController.createTodo);

// editar (incluye marcar como completada) y borrar una tarea
router.put("/todos/:todoId", authMiddleware, validate({ params: todoParams, body: schemas.updateTodo }), todoController.updateTodo);
router.delete("/todos/:todoId", authMiddleware, validate({ params: todoParams }), todoController.deleteTodo);

module.exports = router;
