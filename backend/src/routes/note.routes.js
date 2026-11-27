const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const noteController = require("../controllers/note.controller");
const validate = require("../middlewares/validate.middleware");
const schemas = require("../validators/schemas");
const { idParams } = require("../validators/common");

const subjectParams = idParams("subjectId", "id de materia");
const noteParams = idParams("noteId", "id de nota");

// Este router se monta en /api (ver app.js)

// notas de una materia
router.get("/subjects/:subjectId/notes", authMiddleware, validate({ params: subjectParams }), noteController.getNotes);
router.post("/subjects/:subjectId/notes", authMiddleware, validate({ params: subjectParams, body: schemas.createNote }), noteController.createNote);

// editar y borrar una nota
router.put("/notes/:noteId", authMiddleware, validate({ params: noteParams, body: schemas.updateNote }), noteController.updateNote);
router.delete("/notes/:noteId", authMiddleware, validate({ params: noteParams }), noteController.deleteNote);

module.exports = router;
