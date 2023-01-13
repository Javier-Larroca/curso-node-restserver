const { response } = require("express");
const bcryptjs = require('bcryptjs');
const User = require('../models/usuario');
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

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

const googleSignIn = async (req, res = response) => {
    const {id_token} = req.body;
    try{
        const {name, img, mail} = await googleVerify(id_token);
        let user = await User.findOne({mail});
        if(!user){
            //Crear nuevo usuario por google
            const data = {
                name,
                mail, 
                img, 
                password: 'asd',
                role: 'USER_ROLE',
                google: true
            };
            user = new User(data);
            await user.save();
        }

        //Si el usuario en bbdd esta en false
        if(!user.status){
            return res.status(401).json({
                msg: 'Hable con el admin, usuario bloqueado'
            })
        }

        //Genera el JWT
        const token = await generarJWT(user.id);

        res.json({
            user,
            token
        })
    }catch (error){
        res.status(400).json({
            ok:false,
            msg: 'El token no se pudo verificar'
        })
    }
}


module.exports = {
    login,
    googleSignIn
}