/*
Route: /api/images
*/

const { Router } = require("express");
const {check} = require('express-validator');
const {validateFields} = require('../middlewares/validate-fields')
const { getImages, createImage, updateImage, deleteImage } = require("../controllers/images");
const validateJwt = require("../middlewares/validate-jwt");
const router = Router();

router.get('/', validateJwt, getImages);

router.post('/',[

    validateJwt,
    check('name', 'The name is required').notEmpty(),
    check('price', 'The price is required').notEmpty(),
    check('description', 'The description is required').notEmpty(),
    check('category', 'The category is not valid').isMongoId(), // Evaluamos quie si el Id de la categoria que le pasamos es valida
    validateFields
], createImage);

router.put('/:id',[

    validateJwt,

], updateImage);

router.delete('/:id',validateJwt, deleteImage);

module.exports = router;
