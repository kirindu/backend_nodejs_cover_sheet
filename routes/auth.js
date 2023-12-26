/*
Path: '/api/login'
*/

const {Router} = require('express');
const {check} = require('express-validator');
const {validateFields} = require('../middlewares/validate-fields')
const {login, renewToken} = require('../controllers/auth');
const validateJwt = require("../middlewares/validate-jwt");

const router = Router();

router.post('/',[
    check('email', 'The email is required').isEmail(),
    check('password','The password is required').notEmpty(),
    validateFields,

],login)

router.get('/renew',
validateJwt,
renewToken)




module.exports = router;