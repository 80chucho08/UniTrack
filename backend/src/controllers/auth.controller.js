const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userModel = require("../models/user.model");

const SALT_ROUNDS = 10;

// Registro de usuario

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Todos lo campos son obligatorios"
            });
        }

        //verificar si el usuario ya existe
        const usurioExistente = await userModel.getUserByEmail(email);
        if (usurioExistente) {
            return res.status(409).json({
                message: "El correo ya esta registrado"
            });
        }

        // hash de la contraseña
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        //crear usuario
        const userId = await userModel.createUser({ name, email, passwordHash });

        return res.status(201).json({
            message: "Usuario creado correctamente"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error al registrar al usuario"
        });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email y contraseña son obligatorios"
            });
        }

        const user = await userModel.getUserByEmail(email);
        if (!user) {
            return res.status(401).json({
                message: "Email no existe"
            });
        }

        const passwordValido = await bcrypt.compare(password, user.password_hash);

        if (!passwordValido) {
            return res.status(401).json({
                message: "Contraseña incorrecta"
            });
        }


        //Generar el JWT
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error al iniciar sesion"
        });
    }
}


module.exports = {
    register,
    login
};