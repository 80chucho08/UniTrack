const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const noteController = require("../controllers/note.controller");

// Este router se monta en /api (ver app.js)

// notas de una materia
router.get("/subjects/:subjectId/notes", authMiddleware, noteController.getNotes);
router.post("/subjects/:subjectId/notes", authMiddleware, noteController.createNote);

// editar y borrar una nota
router.put("/notes/:noteId", authMiddleware, noteController.updateNote);
router.delete("/notes/:noteId", authMiddleware, noteController.deleteNote);

module.exports = router;
