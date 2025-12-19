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





module.exports = {createUser};