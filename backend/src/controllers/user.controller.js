const userModel = require("../models/user.model");

const getProfile = async(req, res) => {
    try{
        const userId = req.user.id;

        const user = await userModel.getUserById(userId);

        if(!user) {
            return res.status(404).json({
                message: "Usuario no encontrado"
            });
        }

        return res.json(user);
    }catch (error){
        console.error(error);
        return res.status(500).json({
            message: "Error al obtener perfil"
        });
    }
}

module.exports = { getProfile };