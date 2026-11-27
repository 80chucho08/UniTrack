const jwt = require("jsonwebtoken");
const config = require("../config/env");

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "Token no proporcionado"
        });
    }

    //bEARER token
    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        req.user = decoded; // { id, email }
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Token inválido o expirado"
        });

    }


}

module.exports = authMiddleware;