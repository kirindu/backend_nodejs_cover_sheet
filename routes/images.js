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

    validateFields,

], createImage);

router.put('/:id',[

    validateJwt,

], updateImage);

router.delete('/:id',validateJwt, deleteImage);

module.exports = router;
