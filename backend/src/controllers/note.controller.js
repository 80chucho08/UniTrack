const noteModel = require("../models/note.model");
const subjectModel = require("../models/subject.model");

const getNotes = async (req, res) => {
    try {
        const userId = req.user.id;
        const { subjectId } = req.params;

        if (!(await subjectModel.subjectBelongsToUser(userId, subjectId))) {
            return res.status(404).json({ message: "Materia no encontrada" });
        }

        const notes = await noteModel.getNotesBySubject(userId, subjectId);
        res.status(200).json(notes);
    } catch (error) {
        console.error("Error en getNotes", error);
        res.status(500).json({ message: "Error al obtener las notas" });
    }
};

const createNote = async (req, res) => {
    try {
        const userId = req.user.id;
        const { subjectId } = req.params;
        const { title, content = null } = req.body; // validado por schemas.createNote

        if (!(await subjectModel.subjectBelongsToUser(userId, subjectId))) {
            return res.status(404).json({ message: "Materia no encontrada" });
        }

        const noteId = await noteModel.addNote(userId, subjectId, title, content);
        const note = await noteModel.getNoteById(userId, noteId);

        res.status(201).json(note);
    } catch (error) {
        console.error("Error en createNote", error);
        res.status(500).json({ message: "Error al crear la nota" });
    }
};

const updateNote = async (req, res) => {
    try {
        const userId = req.user.id;
        const { noteId } = req.params;

        const current = await noteModel.getNoteById(userId, noteId);
        if (!current) {
            return res.status(404).json({ message: "Nota no encontrada" });
        }

        // Edición parcial: lo que no viene en el body conserva su valor
        const title = "title" in req.body ? req.body.title : current.title;
        const content = "content" in req.body ? req.body.content : current.content;

        await noteModel.updateNote(userId, noteId, title, content);
        const note = await noteModel.getNoteById(userId, noteId);

        res.status(200).json(note);
    } catch (error) {
        console.error("Error en updateNote", error);
        res.status(500).json({ message: "Error al actualizar la nota" });
    }
};

const deleteNote = async (req, res) => {
    try {
        const userId = req.user.id;
        const { noteId } = req.params;

        const affected = await noteModel.deleteNote(userId, noteId);
        if (!affected) {
            return res.status(404).json({ message: "Nota no encontrada" });
        }

        res.status(200).json({ message: "Nota eliminada" });
    } catch (error) {
        console.error("Error en deleteNote", error);
        res.status(500).json({ message: "Error al eliminar la nota" });
    }
};

module.exports = { getNotes, createNote, updateNote, deleteNote };
