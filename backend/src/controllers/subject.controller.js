const subjectModel = require("../models/subject.model");

// Tamaño máximo aceptado para la imagen de encabezado (caracteres de la data URL)
const MAX_HEADER_IMAGE_LENGTH = 4 * 1024 * 1024;

// Convierte "" en null y recorta espacios
const cleanText = (value) => {
    if (value === undefined || value === null) return null;
    const text = String(value).trim();
    return text === "" ? null : text;
};

const getSubjects = async (req, res) => {
    const userId = req.user.id;
    const { semesterId } = req.params;

    const subjects = await subjectModel.getSubjects(userId, semesterId);
    res.json(subjects);
}

const getAllSubjects = async (req, res) => {
    const subjects = await subjectModel.getSubjectsByUser(req.user.id);
    res.status(200).json(subjects);
}

const getSubjectById = async (req, res) => {
    const userId = req.user.id;
    const { subjectId } = req.params;

    const subject = await subjectModel.getSubjectById(userId, subjectId);

    if (!subject) {
        return res.status(404).json({ message: "Materia no encontrada" });
    }

    res.status(200).json(subject);
}

const createSubject = async (req, res) => {
    const userId = req.user.id;
    const { semesterId } = req.params;

    // req.body validado por schemas.createSubject
    const subjectId = await subjectModel.addSubject(
        userId,
        semesterId,
        req.body
    );

    res.status(201).json({
        message: "Materia creada correctamente",
        subjectId
    });
}

// Actualización parcial: los campos que no vienen en el body se conservan
const updateSubject = async (req, res) => {
    const userId = req.user.id;
    const { subjectId } = req.params;

    const current = await subjectModel.getSubjectById(userId, subjectId);
    if (!current) {
        return res.status(404).json({ message: "Materia no encontrada" });
    }

    // req.body validado por schemas.updateSubject; lo que no viene se conserva
    const body = req.body;
    const pick = (field) => (field in body ? body[field] : current[field]);

    await subjectModel.updateSubject(userId, subjectId, {
        name: pick("name"),
        teacher_name: pick("teacher_name"),
        teacher_email: pick("teacher_email"),
        credits: pick("credits"),
        color: pick("color"),
        evaluation_criteria: pick("evaluation_criteria")
    });

    const updated = await subjectModel.getSubjectById(userId, subjectId);
    res.status(200).json(updated);
}

// Body: { header_image: "data:image/...;base64,..." | "https://..." | null }
const updateHeaderImage = async (req, res) => {
    const userId = req.user.id;
    const { subjectId } = req.params;
    const { header_image } = req.body;

    const image = cleanText(header_image);

    if (image !== null) {
        const isDataUrl = image.startsWith("data:image/");
        const isHttpUrl = /^https?:\/\//i.test(image);

        if (!isDataUrl && !isHttpUrl) {
            return res.status(400).json({ message: "La imagen debe ser una URL o un archivo de imagen" });
        }
        if (image.length > MAX_HEADER_IMAGE_LENGTH) {
            return res.status(413).json({ message: "La imagen es demasiado grande" });
        }
    }

    const affected = await subjectModel.updateHeaderImage(userId, subjectId, image);
    if (!affected) {
        return res.status(404).json({ message: "Materia no encontrada" });
    }

    res.status(200).json({
        message: image ? "Imagen actualizada" : "Imagen eliminada",
        header_image: image
    });
}

const deleteSubject = async (req, res) => {
    const userId = req.user.id;
    const { subjectId } = req.params;

    const affected = await subjectModel.deleteSubject(userId, subjectId);
    if (!affected) {
        return res.status(404).json({ message: "Materia no encontrada" });
    }

    res.status(200).json({ message: "Materia eliminada" });
}

module.exports = {
    getSubjects,
    getAllSubjects,
    getSubjectById,
    createSubject,
    updateSubject,
    updateHeaderImage,
    deleteSubject
};
