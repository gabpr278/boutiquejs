const API_URL = "http://localhost:3000/products";
const catalogElement = document.getElementById('catalog');

// Fonction pour récupérer les produits depuis ton backend Express
async function fetchProducts() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error("Impossible de charger les produits :", error);
        catalogElement.innerHTML = "<p>Erreur de chargement du catalogue.</p>";
    }
}

// Fonction pour afficher les produits dans le DOM
function displayProducts(products) {
    catalogElement.innerHTML = ""; // Vider le conteneur

    products.forEach(product => {
        // Préparation des images (sécurité au cas où il n'y aurait qu'une seule image)
        const firstImage = product.images[0] || 'placeholder.jpg';
        const secondImage = product.images[1] || firstImage;

        // Création de la carte produit
        const card = document.createElement('article');
        card.className = 'product-card';

        // Construction du HTML interne de la carte
        card.innerHTML = `
            <div class="image-container" onclick="viewDetails('${product.id}')">
                <img src="${firstImage}" class="img-default" alt="${product.name}">
                <img src="${secondImage}" class="img-hover" alt="${product.name} - vue alternative">
            </div>
            <div class="product-info">
                <h2>${product.name}</h2>
                <p class="price">${product.price} ${product.currency}</p>
            </div>
        `;

        catalogElement.appendChild(card);
    });
}

// Fonction simulée pour le clic sur "Voir le produit"
function viewDetails(productId) {
    console.log(`Redirection vers les détails du produit ID: ${productId}`);
    // Ici, tu devras implémenter la logique pour afficher la page détaillée
}

// Lancement de l'application
fetchProducts();