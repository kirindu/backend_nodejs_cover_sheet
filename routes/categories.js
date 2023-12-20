/*
Route: /api/categories
*/

const { Router } = require("express");
const {check} = require('express-validator');
const {validateFields} = require('../middlewares/validate-fields')
const validateJwt = require("../middlewares/validate-jwt");

const {getCategories,createCategories,updateCategories,deleteCategories} = require('../controllers/categories')



const router = Router();

router.get('/', getCategories);

router.post('/',[
    validateJwt,
    check('name', 'The name is required').notEmpty(),
    validateFields
], createCategories);

router.put('/:id',[

], updateCategories);

router.delete('/:id', deleteCategories);

module.exports = router;
