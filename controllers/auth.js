const { response } = require("express");
const bcryptjs = require('bcryptjs');
const User = require('../models/usuario');
const { generarJWT } = require("../helpers/generar-jwt");

const login = async (req, res = response) => {
    const {mail, password} = req.body;
    try{
        //Verificar si el correo existe
        const user = await User.findOne({mail});
        if(!user){
            return res.status(400).json({
                msg: 'Correo / Contraseña no son correctos - correo'
            });
        }
        //Verificar que el usuario este activo
        if(!user.status){
            return res.status(400).json({
                msg: 'Correo / Contraseña no son correctos - status false'
            });
        }

        //Verificar contraseña
        const validPassword = bcryptjs.compareSync(password, user.password);
        if(!validPassword){
            return res.status(400).json({
                msg: 'Correo / Contraseña no son correctos - password'
            });
        }

        //Genera el JWT
        const token = await generarJWT(user.id);
        
        res.json({
            user,
            token
        })
    }catch (error){
        console.log(error);
        return res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }

}


module.exports = {
    login
}