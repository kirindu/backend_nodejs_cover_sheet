/*
Route: /api/routes
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validateFields } = require("../middlewares/validate-fields");
const validateJwt = require("../middlewares/validate-jwt");

const {
  getRoutes,
  createRoutes,
  updateRoutes,
  deleteRoutes,
} = require("../controllers/routes");

const router = Router();

// router.get('/',[validateJwt], getRoutes); // Creo que no hay necesidad de validar por token la consulta
router.get("/", getRoutes);

router.post(
  "/",
  [
    validateJwt,
    check("name", "The name is required").notEmpty(),
    validateFields,
  ],
  createRoutes
);

router.put("/:id", [], updateRoutes);

router.delete("/:id", deleteRoutes);

module.exports = router;
