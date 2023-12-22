/*
Route: /api/posts
*/

const { Router } = require("express");
const expressfileUpload = require('express-fileupload');


const {check} = require('express-validator');
const {validateFields} = require('../middlewares/validate-fields')
const { getPosts, createPost, updatePost, deletePost } = require("../controllers/posts");
const validateJwt = require("../middlewares/validate-jwt");
const router = Router();

// Con esto truncamos la imagen a que pese maximo 1M
// router.use(expressfileUpload({
//     limits: { fileSize: 1 * 1024 * 1024 },
//   }));

  router.use(expressfileUpload());

router.get('/', validateJwt, getPosts);

router.post('/',[

    validateJwt,
    check('name', 'The name is required').notEmpty(),
   // check('image', 'The image is required').notEmpty(),
    check('price', 'The price is required').notEmpty(),
    check('description', 'The description is required').notEmpty(),
    check('category', 'The category is not valid').isMongoId(), // Evaluamos quie si el Id de la categoria que le pasamos es valida
    validateFields
], createPost);

router.put('/:id',[

    validateJwt,
    check('name', 'The name is required').notEmpty(),
   // check('image', 'The image is required').notEmpty(),
    check('price', 'The price is required').notEmpty(),
    check('description', 'The description is required').notEmpty(),
    check('category', 'The category is not valid').isMongoId(), // Evaluamos quie si el Id de la categoria que le pasamos es valida
    validateFields

], updatePost);

router.delete('/:id',validateJwt, deletePost);

module.exports = router;
