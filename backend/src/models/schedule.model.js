const { pool } = require("../config/db");

const getSubjectsBySemester = async (userId, semesterId) => {
    const query = `SELECT 
            Sb.id, 
            Sb.user_id, 
            Sb.semester_id, 
            Sb.name,
            Sb.color
        FROM subjects Sb
        INNER JOIN semesters S ON Sb.semester_id = S.id
        WHERE Sb.user_id = ? AND Sb.semester_id = ?`;

    const [rows] = await pool.execute(query, [userId, semesterId]);

    return rows;
}

const saveScheduleSubject = async (scheduleData) => {
    const { user_id, subject_id, day, start_time, end_time, classroom } = scheduleData;
    const query = `INSERT INTO schedule (user_id, subject_id, day, start_time, end_time, classroom)
        VALUES (?, ?, ?, ?, ?, ?)`;
    
    const [result] = await pool.execute(query, [
        user_id, 
        subject_id, 
        day, 
        start_time, 
        end_time, 
        classroom
    ]);

    return result;
}

const deleteScheduleSubject = async (userId, scheduleId) => {
    const query = `DELETE FROM schedule WHERE id = ? AND user_id = ?`;
    const [result] = await pool.execute(query, [scheduleId, userId]);
    return result;
}

const getScheduleSubjects = async (userId) => {
    const query = `
        SELECT 
            sch.id as schedule_id,
            sch.day,
            sch.start_time,
            sch.end_time,
            sch.classroom,
            sub.name as subject_name,
            sub.color as subject_color,
            sub.id as subject_id
        FROM schedule sch
        INNER JOIN subjects sub ON sch.subject_id = sub.id
        WHERE sch.user_id = ?
    `;
    const [rows] = await pool.execute(query, [userId]);
    return rows;
}


// Clases de una sola materia, ordenadas por día y hora
const getScheduleBySubject = async (userId, subjectId) => {
    const query = `
        SELECT
            id AS schedule_id,
            day,
            TIME_FORMAT(start_time, '%H:%i') AS start_time,
            TIME_FORMAT(end_time, '%H:%i') AS end_time,
            classroom
        FROM schedule
        WHERE user_id = ? AND subject_id = ?
        ORDER BY FIELD(day, 'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'), start_time
    `;
    const [rows] = await pool.execute(query, [userId, subjectId]);
    return rows;
}


module.exports = { getSubjectsBySemester, saveScheduleSubject, deleteScheduleSubject, getScheduleSubjects, getScheduleBySubject };