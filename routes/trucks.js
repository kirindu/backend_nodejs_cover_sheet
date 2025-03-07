/*
Route: /api/trucks
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validateFields } = require("../middlewares/validate-fields");
const validateJwt = require("../middlewares/validate-jwt");

const {
  getTrucks,
  createTrucks,
  updateTrucks,
  deleteTrucks,
} = require("../controllers/trucks");

const router = Router();

// router.get('/',[validateJwt], getTrucks); // Creo que no hay necesidad de validar por token la consulta
router.get("/", getTrucks);

router.post(
  "/",
  [
    validateJwt,
    check("name", "The name is required").notEmpty(),
    validateFields,
  ],
  createTrucks
);

router.put("/:id", [], updateTrucks);

router.delete("/:id", deleteTrucks);

module.exports = router;
