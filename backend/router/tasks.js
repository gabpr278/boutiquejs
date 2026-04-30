const express = require("express");
const router = express.Router();

const produitsController = require("../controller/tasks");

// Toutes les routes produits
router.get("/", produitsController.afficherTousLesProduits);
router.get("/:id", produitsController.afficherUnProduit);
router.put("/:id/stock", produitsController.modifierStock);

module.exports = router;