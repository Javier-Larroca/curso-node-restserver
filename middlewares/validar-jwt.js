const { response, request } = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/usuario');

const validarJWT = async (req = request, res = response, next) => {
    const token = req.header('x-token');
    if(!token){
        return res.status(401).json({
            msg: 'No hay token en la petición.'
        })
    }
    try{
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        //Buscar el usuario en la bbdd
        const user = await User.findById(uid);
        //Validar que el usuario no haya sido eliminado de la bbdd
        if(!user){
            return res.status(401).json({
                msg: 'Token no válido - Usuario inexistente.'
            })
        }
        //Validar si el usuario sigue activo
        if(!user.status){
            return res.status(401).json({
                msg: 'Token no válido - Usuario ya no activo.'
            })
        }

        req.user = user;
        next();
    }
    catch(error){
        console.log(error);
        res.status(401).json({
            msg:'Token no válido'
        });
    }
}

module.exports = {
    validarJWT
}