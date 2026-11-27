const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const config = require("../config/env");

const userModel = require("../models/user.model");

// Costo de bcrypt: cada +1 DUPLICA el tiempo de calcular un hash. 12 tarda ~250 ms:
// imperceptible para un usuario, pero vuelve muy lento probar millones de contraseñas
// si alguien roba la base de datos. Súbelo con los años, a medida que el hardware mejora.
const SALT_ROUNDS = 12;

// Mismo mensaje para "el correo no existe" y "la contraseña no coincide":
// si fueran distintos, cualquiera podría averiguar qué correos tienen cuenta.
const INVALID_CREDENTIALS = "Correo o contraseña incorrectos";

// Hash de relleno para comparar cuando el correo no existe (ver login)
let dummyHashPromise;
const getDummyHash = () => {
    dummyHashPromise ??= bcrypt.hash(crypto.randomBytes(16).toString("hex"), SALT_ROUNDS);
    return dummyHashPromise;
};

// Token + datos públicos del usuario (lo que responden login y registro)
const authResponse = (user) => ({
    token: jwt.sign({ id: user.id, email: user.email }, config.jwtSecret, { expiresIn: "1d" }),
    user: { id: user.id, name: user.name, email: user.email },
});

const register = async (req, res) => {
    // req.body ya viene validado y limpio (validators/schemas.js → register)
    const { name, email, password } = req.body;

    const existingUser = await userModel.getUserByEmail(email);
    if (existingUser) {
        return res.status(409).json({ message: "El correo ya está registrado" });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const id = await userModel.createUser({ name, email, passwordHash });

    // Queda con la sesión iniciada, como espera Register.tsx
    return res.status(201).json({
        message: "Usuario creado correctamente",
        ...authResponse({ id, name, email }),
    });
};

const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await userModel.getCredentialsByEmail(email);

    // Siempre se ejecuta bcrypt.compare, exista o no el correo. Si respondiéramos al
    // instante cuando no existe (~5 ms) y tras 250 ms cuando sí, el TIEMPO de respuesta
    // delataría qué correos están registrados (ataque de temporización).
    const hash = user ? user.password_hash : await getDummyHash();
    const passwordValid = await bcrypt.compare(password, hash);

    if (!user || !passwordValid) {
        return res.status(401).json({ message: INVALID_CREDENTIALS });
    }

    // Hashes creados con un costo menor (cuentas antiguas, costo 10): se recalculan
    // ahora, que es el único momento en que tenemos la contraseña en claro.
    if (bcrypt.getRounds(user.password_hash) < SALT_ROUNDS) {
        try {
            await userModel.updatePasswordHash(user.id, await bcrypt.hash(password, SALT_ROUNDS));
            req.log.info({ userId: user.id }, "Hash de contraseña actualizado al costo actual");
        } catch (error) {
            // No es motivo para impedir el login: se reintentará en el siguiente
            req.log.warn({ err: error, userId: user.id }, "No se pudo actualizar el hash de contraseña");
        }
    }

    return res.json(authResponse(user));
};

module.exports = { register, login };
