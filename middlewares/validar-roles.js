const { request, response } = require("express")

const esAdminRole = (req = request, res = response, next) => {
    if(!req.user){
        return res.status(500).json({
            msg: 'Se requiere verificar rol, sin validar token.'
        })
    }
    const {role, name} = req.user;
    if(role !== 'ADMIN_ROLE'){
        return res.status(401).json({
            msg: `${name} no es administrador - No puede realizar esta accion.`
        })
    }
    next();
}

const tieneRole = (...roles) => {
    return (req, res, next) => {
        if(!req.user){
            return res.status(500).json({
                msg: 'Se requiere verificar rol, sin validar token.'
            })
        }
        if(!roles.includes(req.user.role)){
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles: ${roles}`
            })
        }
        next();
    }
}

module.exports = {
    esAdminRole,
    tieneRole
}