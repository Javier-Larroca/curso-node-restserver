const {Router} = require('express');
const { check } = require('express-validator');
const { usuariosGet, usuariosPut, usuariosPost, usuariosDelete, usuariosPatch } = require('../controllers/usuarios');
const { isRoleValid, mailExist, existUserForId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.get('/', usuariosGet);

router.put('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existUserForId),
    check('role').custom(isRoleValid),
    validarCampos
], usuariosPut);

router.post('/', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe contener mas de 6 caracteres').isLength({min: 6}),
    check('mail', 'El correo no es válido').isEmail(),
    check('mail').custom(mailExist),
    check('role').custom(isRoleValid),
    validarCampos
], usuariosPost);

router.delete('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existUserForId),
    validarCampos
], usuariosDelete);

router.patch('/', usuariosPatch);

module.exports = router;