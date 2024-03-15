/*
Route: /api/users
*/

const { Router } = require("express");
const {check} = require('express-validator');
const {validateFields} = require('../middlewares/validate-fields')
const { getUsers, createUsers, updateUsers, deleteUser } = require("../controllers/users");
const { getUser} = require("../controllers/user");
const validateJwt = require("../middlewares/validate-jwt");
const router = Router();

router.get('/', validateJwt, getUser);

module.exports = router;
