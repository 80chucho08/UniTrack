const { pool } = require("../config/db");

const getSubjects = async(id, semesterId) => {
    const query = (``);

    const [rows] = await pool.execute(query, [id, semesterId]);

    return rows;
}


const addSubject = async(userId, semesterId, subjectId) => {
    const query = (``);

    const [result] = await pool.execute(query, []);
    
    return result.insertId;

}

module.exports = { getSubjects, addSubject };