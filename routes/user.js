/*
Route: /api/user
*/

const { Router } = require("express");
const { getUser} = require("../controllers/user");
const validateJwt = require("../middlewares/validate-jwt");
const router = Router();

router.get('/', validateJwt, getUser);

module.exports = router;
