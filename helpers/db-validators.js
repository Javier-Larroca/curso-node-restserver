const Role = require('../models/role');
const User = require('../models/usuario');

const isRoleValid = async (role = '') => {
    const existRole = await Role.findOne({role});
    if(!existRole){
        throw new Error(`El rol ${role} no está registrado en la base de datos.`);
    }
}

const mailExist = async (mail = '') => {
    //Verificar si el correo existe
    const existMail = await User.findOne({mail})
    if(existMail){
        throw new Error(`El correro ${mail}, ya está registrado`);
    }
}

const existUserForId = async (id) => {
    //Verificar si el id existe
    const existId = await User.findById(id)
    if(!existId){
        throw new Error(`El id ${id}, no se cuentra registrado`);
    }
}

module.exports = {
    isRoleValid,
    mailExist,
    existUserForId
}