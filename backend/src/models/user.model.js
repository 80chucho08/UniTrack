const {pool} = require("../config/db");

/**
 * Crear un nuevo usuario
 * @param {Object} user
 * @param {string} user.name
 * @param {string} user.email
 * @param {string} user.passwordHash
 * @returns {number} id del usuario creado
 */

const createUser = async({name, email, passwordHash}) => {
    const query = (`INSERT INTO users (name, email, password_hash, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())`);

    const [result] = await pool.execute(query, [ name, email, passwordHash ]);

    return result.insertId;
}

const getUserByEmail = async (email) => {
    const query = (`SELECT *FROM users WHERE email = ? LIMIT 1`);

    const [rows] = await pool.execute(query, [email]);
    
    return rows.length ? rows[0] : null;
}


const getUserById = async (id) => {
    const query = (`SELECT *FROM users WHERE id = ? LIMIT 1`);
    const [rows] = await pool.execute(query, [id]);

    return rows.length ? rows[0] : null;
}


module.exports = { createUser, getUserByEmail, getUserById };