const { pool } = require("../config/db");

// Columnas que se pueden devolver al cliente. NUNCA uses SELECT * en users:
// traería password_hash y bastaría un res.json(user) para filtrarlo.
const PUBLIC_COLUMNS = "id, name, email, created_at";

/**
 * Crear un nuevo usuario
 * @param {Object} user
 * @param {string} user.name
 * @param {string} user.email
 * @param {string} user.passwordHash
 * @returns {number} id del usuario creado
 */
const createUser = async ({ name, email, passwordHash }) => {
    const query = `INSERT INTO users (name, email, password_hash, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())`;
    const [result] = await pool.execute(query, [name, email, passwordHash]);
    return result.insertId;
};

// Datos públicos por email (p. ej. comprobar si ya existe)
const getUserByEmail = async (email) => {
    const [rows] = await pool.execute(`SELECT ${PUBLIC_COLUMNS} FROM users WHERE email = ? LIMIT 1`, [email]);
    return rows.length ? rows[0] : null;
};

const getUserById = async (id) => {
    const [rows] = await pool.execute(`SELECT ${PUBLIC_COLUMNS} FROM users WHERE id = ? LIMIT 1`, [id]);
    return rows.length ? rows[0] : null;
};

// ÚNICA función que lee password_hash. Solo para el login: no la devuelvas tal cual.
const getCredentialsByEmail = async (email) => {
    const [rows] = await pool.execute(`SELECT id, name, email, password_hash FROM users WHERE email = ? LIMIT 1`, [email]);
    return rows.length ? rows[0] : null;
};

const updatePasswordHash = async (id, passwordHash) => {
    await pool.execute(`UPDATE users SET password_hash = ?, updated_at = NOW() WHERE id = ?`, [passwordHash, id]);
};

module.exports = { createUser, getUserByEmail, getUserById, getCredentialsByEmail, updatePasswordHash };
