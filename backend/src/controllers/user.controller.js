const userModel = require("../models/user.model");

const getProfile = async (req, res) => {
    const userId = req.user.id;

    const user = await userModel.getUserById(userId);

    if (!user) {
        return res.status(404).json({
            message: "Usuario no encontrado"
        });
    }

    return res.json(user);
};

module.exports = { getProfile };
