const { pool } = require("../config/db");

const getSubjects = async(id, semesterId) => {
    const query = (``);

    const [rows] = await pool.execute(query, [id, semesterId]);

    return rows;
}


const addSubject = async() => {

}

module.exports = { getSubjects, addSubject };