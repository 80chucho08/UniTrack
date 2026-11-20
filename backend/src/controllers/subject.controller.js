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
    try {
        const userId = req.user.id;
        const { semesterId } = req.params;

        if (!userId || !semesterId) {
            return res.status(400).json({
                message: "El id del usuario o el id de semestre es requerido"
            });
        }

        const subjects = await subjectModel.getSubjects(userId, semesterId);
        res.json(subjects);
    } catch (error) {
        console.error("Error en getSubjects", error);
        res.status(500).json({ message: "Error al obtener materias" });
    }
}

const getSubjectById = async (req, res) => {
    try {
        const userId = req.user.id;
        const { subjectId } = req.params;

        const subject = await subjectModel.getSubjectById(userId, subjectId);

        if (!subject) {
            return res.status(404).json({ message: "Materia no encontrada" });
        }

        res.status(200).json(subject);
    } catch (error) {
        console.error("Error en getSubjectById", error);
        res.status(500).json({ message: "Error al obtener la materia" });
    }
}

const createSubject = async (req, res) => {
    try {
        const userId = req.user.id;
        const { semesterId } = req.params;
        if (!userId || !semesterId) {
            return res.status(400).json({
                message: "El id del usuario o el id de semestre es requerido"
            });
        }
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: "El nombre de la materia es obligatorio" });
        }

        const subjectId = await subjectModel.addSubject(
            userId,
            semesterId,
            req.body
        );

        res.status(201).json({
            message: "Materia creada correctamente",
            subjectId
        });
    } catch (error) {
        console.error("Error en createSubject", error);
        res.status(500).json({ message: "Error al crear materia" });
    }
}

// Actualización parcial: los campos que no vienen en el body se conservan
const updateSubject = async (req, res) => {
    try {
        const userId = req.user.id;
        const { subjectId } = req.params;

        const current = await subjectModel.getSubjectById(userId, subjectId);
        if (!current) {
            return res.status(404).json({ message: "Materia no encontrada" });
        }

        const body = req.body;
        const pick = (field) => (field in body ? cleanText(body[field]) : current[field]);

        const name = pick("name");
        if (!name) {
            return res.status(400).json({ message: "El nombre de la materia es obligatorio" });
        }

        let credits = current.credits;
        if ("credits" in body) {
            credits = cleanText(body.credits) === null ? null : Number(body.credits);
            if (credits !== null && (!Number.isInteger(credits) || credits < 0)) {
                return res.status(400).json({ message: "Los créditos deben ser un número entero positivo" });
            }
        }

        await subjectModel.updateSubject(userId, subjectId, {
            name,
            teacher_name: pick("teacher_name"),
            teacher_email: pick("teacher_email"),
            credits,
            color: pick("color"),
            evaluation_criteria: pick("evaluation_criteria")
        });

        const updated = await subjectModel.getSubjectById(userId, subjectId);
        res.status(200).json(updated);
    } catch (error) {
        console.error("Error en updateSubject", error);
        res.status(500).json({ message: "Error al actualizar la materia" });
    }
}

// Body: { header_image: "data:image/...;base64,..." | "https://..." | null }
const updateHeaderImage = async (req, res) => {
    try {
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
    } catch (error) {
        console.error("Error en updateHeaderImage", error);
        res.status(500).json({ message: "Error al actualizar la imagen" });
    }
}

const deleteSubject = async (req, res) => {
    try {
        const userId = req.user.id;
        const { subjectId } = req.params;

        const affected = await subjectModel.deleteSubject(userId, subjectId);
        if (!affected) {
            return res.status(404).json({ message: "Materia no encontrada" });
        }

        res.status(200).json({ message: "Materia eliminada" });
    } catch (error) {
        console.error("Error en deleteSubject", error);
        res.status(500).json({ message: "Error al eliminar la materia" });
    }
}

module.exports = {
    getSubjects,
    getSubjectById,
    createSubject,
    updateSubject,
    updateHeaderImage,
    deleteSubject
};
