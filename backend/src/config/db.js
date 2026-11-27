const mysql = require("mysql2/promise");
const config = require("./env");
const logger = require("./logger");

const pool = mysql.createPool({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.name,
    port: config.db.port,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const testConnection = async () => {
    try {
        await pool.query("SELECT 1");
        logger.info({ host: config.db.host, database: config.db.name }, "Conexión con la BD establecida");
    } catch (error) {
        logger.error({ err: error }, "No se pudo conectar a la BD");
    }
};

module.exports = { pool, testConnection };
