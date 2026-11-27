const mysql = require("mysql2/promise");
const config = require("./env");

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
        const [rows] = await pool.query("SELECT 1 + 1 AS RESULT");
        console.log("Conexion con BD creada", rows);
    } catch (error) {
        console.log("error al conectar bd", error);
    }
};

module.exports = { pool, testConnection };
