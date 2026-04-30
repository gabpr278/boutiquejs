const URL_API = "http://localhost:3000/products";
const elementCatalogue = document.getElementById('catalog');

// Fonction pour récupérer les produits depuis le serveur (backend)
async function recupererProduits() {
    try {
        const reponse = await fetch(URL_API);
        if (!reponse.ok) {
            console.log("Il y a une erreur avec le serveur");
            return;
        }
        const listeDesProduits = await reponse.json();
        afficherLesProduits(listeDesProduits);
    } catch (erreur) {
        console.log("Impossible de charger les produits :", erreur);
        if (elementCatalogue) {
            elementCatalogue.innerHTML = "<p>Erreur, veuillez lancer le serveur backend.</p>";
        }
    }
}

// Fonction pour créer et afficher les produits sur la page d'accueil
function afficherLesProduits(produits) {
    if (!elementCatalogue) return; // Sécurité si on n'est pas sur la page d'accueil

    elementCatalogue.innerHTML = ""; 

    // On fait une boucle pour parcourir chaque produit
    for (let i = 0; i < produits.length; i++) {
        let produit = produits[i];
        
        let image1 = produit.images[0] || 'placeholder.jpg';
        let image2 = produit.images[1] || image1; 

        let carte = document.createElement('article');
        carte.className = 'product-card';

        // Au clic, on va vers la page produit.html avec l'id du produit dans l'URL
        carte.innerHTML = `
            <div class="image-container" onclick="allerVersProduit('${produit.id}')">
                <img src="${image1}" class="img-default" alt="${produit.name}">
                <img src="${image2}" class="img-hover" alt="${produit.name}">
            </div>
            <div class="product-info">
                <h2>${produit.name}</h2>
                <p class="price">${produit.price} ${produit.currency}</p>
            </div>
        `;

        elementCatalogue.appendChild(carte);
    }
}

// Fonction pour changer de page
function allerVersProduit(idDuProduit) {
    window.location.href = "produit.html?id=" + idDuProduit;
}

// On démarre le programme si on est sur la page d'accueil
if (elementCatalogue) {
    recupererProduits();
}