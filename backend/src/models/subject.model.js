const { pool } = require("../config/db");

const getSubjects = async (userId, semesterId) => {
    const query = `SELECT
            Sb.id,
            Sb.user_id,
            Sb.semester_id,
            Sb.name,
            Sb.teacher_name,
            Sb.color
        FROM subjects Sb
        INNER JOIN semesters S ON Sb.semester_id = S.id
        WHERE Sb.user_id = ? AND Sb.semester_id = ?`;

    const [rows] = await pool.execute(query, [userId, semesterId]);

    return rows;
}

// Detalle de una materia del usuario, con datos de su semestre
const getSubjectById = async (userId, subjectId) => {
    const query = `SELECT
            Sb.id,
            Sb.user_id,
            Sb.semester_id,
            Sb.name,
            Sb.teacher_name,
            Sb.teacher_email,
            Sb.credits,
            Sb.color,
            Sb.evaluation_criteria,
            Sb.header_image,
            Sb.created_at,
            S.name AS semester_name,
            S.period AS semester_period
        FROM subjects Sb
        INNER JOIN semesters S ON Sb.semester_id = S.id
        WHERE Sb.user_id = ? AND Sb.id = ?`;

    const [rows] = await pool.execute(query, [userId, subjectId]);

    return rows[0];
}


const addSubject = async (userId, semesterId, subjectData) => {
    // Desestructuramos los datos del objeto subjectData
    const {
        name,
        teacher_name = null,
        teacher_email = null,
        credits = null,
        color = null,
        evaluation_criteria = null
    } = subjectData;

    const query = `
        INSERT INTO subjects (
            user_id,
            semester_id,
            name,
            teacher_name,
            teacher_email,
            credits,
            color,
            evaluation_criteria
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        userId,
        semesterId,
        name,
        teacher_name,
        teacher_email,
        credits,
        color,
        evaluation_criteria
    ];

    const [result] = await pool.execute(query, values);

    // Retornamos el ID de la materia recién creada
    return result.insertId;
};

const updateSubject = async (userId, subjectId, subjectData) => {
    const {
        name,
        teacher_name,
        teacher_email,
        credits,
        color,
        evaluation_criteria
    } = subjectData;

    const query = `
        UPDATE subjects SET
            name = ?,
            teacher_name = ?,
            teacher_email = ?,
            credits = ?,
            color = ?,
            evaluation_criteria = ?
        WHERE id = ? AND user_id = ?
    `;

    const [result] = await pool.execute(query, [
        name,
        teacher_name,
        teacher_email,
        credits,
        color,
        evaluation_criteria,
        subjectId,
        userId
    ]);

    return result.affectedRows;
};

const updateHeaderImage = async (userId, subjectId, headerImage) => {
    const query = `UPDATE subjects SET header_image = ? WHERE id = ? AND user_id = ?`;
    const [result] = await pool.execute(query, [headerImage, subjectId, userId]);
    return result.affectedRows;
};

// Comprobación ligera de propiedad (sin traer la imagen)
const subjectBelongsToUser = async (userId, subjectId) => {
    const query = `SELECT id FROM subjects WHERE id = ? AND user_id = ?`;
    const [rows] = await pool.execute(query, [subjectId, userId]);
    return rows.length > 0;
};

// Borra la materia; notas, calificaciones y horario se eliminan en cascada.
// La FK de todos es ON DELETE SET NULL, así que sus tareas se borran explícitamente
// para no dejarlas huérfanas.
const deleteSubject = async (userId, subjectId) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        await connection.execute(
            `DELETE FROM todos WHERE subject_id = ? AND user_id = ?`,
            [subjectId, userId]
        );
        const [result] = await connection.execute(
            `DELETE FROM subjects WHERE id = ? AND user_id = ?`,
            [subjectId, userId]
        );
        await connection.commit();
        return result.affectedRows;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};


module.exports = {
    getSubjects,
    getSubjectById,
    addSubject,
    updateSubject,
    updateHeaderImage,
    subjectBelongsToUser,
    deleteSubject
};
