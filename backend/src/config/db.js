const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const testConnection = async () => {
    try {
        const [rows] = await pool.query("SELECT 1 + 1 AS RESULT");
        console.log("Conexion con BD creada", rows);
    }catch (error){
        console.log("error al conectar bd", error);
    }
}

module.exports = { pool, testConnection };