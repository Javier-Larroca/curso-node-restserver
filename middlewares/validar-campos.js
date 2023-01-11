const { validationResult } = require("express-validator");

const validarCampos = (req, res, next) =>{
    //Verificar si el correo es valido
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json(errors)
    }
    next();
}

module.exports = {
    validarCampos
}