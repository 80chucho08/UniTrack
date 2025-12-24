const {pool} = require("../config/db");


const getSemestersByUser = async(id) => {
    const query = (`SELECT S.id, S.name 
                    FROM users U 
                    JOIN semesters S
                        ON U.id = S.user_id
                    WHERE U.id = ?`);
    const [rows] = await pool.execute(query, [id]);

    return rows;
}

const AddSemester = async(userId, name ) => {
    const query = (`INSERT INTO semesters (user_id, name, created_at) VALUES (?, ?, NOW())`);

    const [result] = await pool.execute(query, [userId, name]);

    return result.insertId;
}

module.exports = { getSemestersByUser, AddSemester };