const fs = require("fs");

const fichierData = "./data.json";

// Lire les produits
function lireProduits() {
  const data = fs.readFileSync(fichierData, "utf-8");
  return JSON.parse(data);
}

// Sauvegarder les produits
function sauvegarderProduits(produits) {
  fs.writeFileSync(fichierData, JSON.stringify(produits, null, 2));
}

// Afficher tous les produits
exports.afficherTousLesProduits = (req, res) => {
  const produits = lireProduits();
  res.json(produits);
};

// Afficher un produit
exports.afficherUnProduit = (req, res) => {
  const produits = lireProduits();
  const produit = produits.find(p => p.id === req.params.id);

  if (produit) {
    res.json(produit);
  } else {
    res.status(404).json({ message: "Produit non trouvé" });
  }
};

// Modifier le stock
exports.modifierStock = (req, res) => {
  const produits = lireProduits();
  const produit = produits.find(p => p.id === req.params.id);
  const quantite = req.body.quantity;

  if (!produit) {
    res.status(404).json({ message: "Produit non trouvé" });
    return;
  }

  if (!quantite || quantite <= 0) {
    res.status(400).json({ message: "Quantité invalide" });
    return;
  }

  if (produit.stock < quantite) {
    res.status(400).json({ message: "Stock insuffisant" });
    return;
  }

  produit.stock -= quantite;

  sauvegarderProduits(produits);

  res.json({
    message: "Stock mis à jour",
    produit: produit
  });
};