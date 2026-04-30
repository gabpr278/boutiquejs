const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;

const routesProduits = require("./router/tasks");

app.use(cors());
app.use(express.json());

// Route de test
app.get("/", (req, res) => {
  res.send("API e-commerce fonctionne");
});

// Routes produits
app.use("/products", routesProduits);

app.listen(port, () => {
  console.log("Serveur lancé sur http://localhost:" + port);
});