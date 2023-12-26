/*
Route: /api/users
*/

const { Router } = require("express");
const {check} = require('express-validator');
const {validateFields} = require('../middlewares/validate-fields')
const { getUsers, createUsers, updateUsers, deleteUser } = require("../controllers/users");
const validateJwt = require("../middlewares/validate-jwt");
const router = Router();

router.get('/', validateJwt, getUsers);

router.post('/',[
    check('name', 'The name is required').notEmpty(),
    check('surname','The surname is required').notEmpty(),
    check('password','The password is required' ).notEmpty(),
    check('email', 'The email is required').isEmail(),
    check('rol', 'The rol is required').isEmail(),
    validateFields,

], createUsers);

router.put('/:id',[

    validateJwt,
    check('name', 'The name is required').notEmpty(),
    check('surname','The surname is required').notEmpty(),
    check('email', 'The email is required').isEmail(),
    check('rol','The rol is required').notEmpty(),
    validateFields,

], updateUsers);

router.delete('/:id',validateJwt, deleteUser);

module.exports = router;
