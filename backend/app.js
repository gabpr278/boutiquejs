const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;

const routesProduits = require("./router/tasks");

app.use(cors());
app.use(express.json());

const path = require("path");

// Servir les fichiers statiques du frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// Routes produits
app.use("/products", routesProduits);

app.listen(port, () => {
  console.log("Serveur lancé sur http://localhost:" + port);
});