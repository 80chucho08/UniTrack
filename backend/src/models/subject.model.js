const { pool } = require("../config/db");

const getSubjects = async(id, semesterId) => {
    const query = (`SELECT Sb.id, Sb.user_id, Sb.semester_id, Sb.name
                    FROM user U 
                    JOIN semesters S
                        ON U.id = S.user_id
                    JOIN subjects Sb
                     ON S.user_id =  Sb.user_id`);

    const [rows] = await pool.execute(query, [id, semesterId]);

    return rows;
}


const addSubject = async(userId, semesterId, subjectId) => {
    const query = (``);

    const [result] = await pool.execute(query, []);
    
    return result.insertId;

}

module.exports = { getSubjects, addSubject };