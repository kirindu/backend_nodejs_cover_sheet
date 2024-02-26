/*
Route: /api/posts
*/

const { Router } = require("express");
const expressfileUpload = require('express-fileupload');


const {check} = require('express-validator');
const {validateFields} = require('../middlewares/validate-fields')
const { getPosts, createPost, updatePost, deletePost, getImage } = require("../controllers/posts");
const validateJwt = require("../middlewares/validate-jwt");
const router = Router();

// Con esto truncamos la imagen a que pese maximo 1M
// router.use(expressfileUpload({
//     limits: { fileSize: 1 * 1024 * 1024 },
//   }));

  router.use(expressfileUpload());

//router.get('/', validateJwt, getPosts);
router.get('/', [], getPosts); // En este caso no validaremos el jwt


router.get('/image/:image', [], getImage);

router.post('/',[

    validateJwt,
    check('name', 'The name is required').notEmpty(),
   // check('image', 'The image is required').notEmpty(),
    check('price', 'The price is required').notEmpty(),
    check('description', 'The description is required').notEmpty(),
    check('category', 'The category is not valid').isMongoId(), // Evaluamos quie si el Id de la categoria que le pasamos es valida
    
    // check('year', 'The year is required').notEmpty(),
    // check('make', 'The make is required').notEmpty(),
    // check('model', 'The model is required').notEmpty(),
    // check('engine', 'The engine is required').notEmpty(),
    // check('transmission', 'The transmission is required').notEmpty(),
    // check('suspension', 'The suspension is required').notEmpty(),
    // check('fuel', 'The fuel is required').notEmpty(),
    // check('vin', 'The vin is required').notEmpty(),
    // check('bodySize', 'The body size is required').notEmpty(),
    
    
    validateFields
], createPost);

router.put('/:id',[

    validateJwt,
    check('name', 'The name is required').notEmpty(),
   // check('image', 'The image is required').notEmpty(),
    check('price', 'The price is required').notEmpty(),
    check('description', 'The description is required').notEmpty(),
    check('category', 'The category is not valid').isMongoId(), // Evaluamos quie si el Id de la categoria que le pasamos es valida
    
    check('year', 'The year is required').notEmpty(),
    check('make', 'The make is required').notEmpty(),
    check('model', 'The model is required').notEmpty(),
    check('engine', 'The engine is required').notEmpty(),
    check('transmission', 'The transmission is required').notEmpty(),
    check('suspension', 'The suspension is required').notEmpty(),
    check('fuel', 'The fuel is required').notEmpty(),
    check('vin', 'The vin is required').notEmpty(),
    check('bodySize', 'The body size is required').notEmpty(),
    
    
    validateFields

], updatePost);

router.delete('/:id',validateJwt, deletePost);

module.exports = router;
