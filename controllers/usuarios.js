const {response, request} = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../models/usuario');

const usuariosGet = async (req = request, res = response) => {
    const {limit = 5, desde = 0} = req.query;
    const query = { status: true};

    const resp = await Promise.all([
        User.countDocuments(query),
        User.find(query)
            .skip(Number(desde))
            .limit(Number(limit))
    ]);


    res.json({resp});
}

const usuariosPost = async (req, res = response) => {
    const {name, mail, password, role} = req.body;
    const user = new User({name, mail, password, role});
    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);
    //Guardar en DB
    await user.save();
    res.json({user});
}

const usuariosPut = async (req, res = response) => {
    const {id} = req.params;
    const {password, google, mail, _id, ...resto} = req.body;
    //Validacion contra BBDD
    if(password){
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }
    const user = await User.findByIdAndUpdate(id, resto);
    res.json({user});
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch Api - controlador'
    })
}

const usuariosDelete = async (req, res = response) => {
    const {id} = req.params;
    const uid = req.uid;
    //Eliminar de manera fisica
      //const user = await User.findByIdAndDelete(id);

    //De manera logica
    const user = await User.findByIdAndUpdate(id, {status: false});
    const userAutenticado = req.user;
    
    res.json({user, userAutenticado})
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}