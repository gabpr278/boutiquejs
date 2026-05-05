const URL_API = "http://localhost:3000/products";
const elementCatalogue = document.getElementById('catalog');

let tousLesProduits = [];

// Fonction pour récupérer les produits depuis le serveur (backend)
async function recupererProduits() {
    try {
        const reponse = await fetch(URL_API);
        if (!reponse.ok) {
            console.log("Il y a une erreur avec le serveur");
            return;
        }
        tousLesProduits = await reponse.json();
        afficherLesProduits(tousLesProduits);
    } catch (erreur) {
        console.log("Impossible de charger les produits :", erreur);
        if (elementCatalogue) {
            elementCatalogue.innerHTML = "<p>Erreur, veuillez lancer le serveur backend.</p>";
        }
    }
}

// Fonction pour créer et afficher les produits sur la page d'accueil
function afficherLesProduits(produits) {
    if (!elementCatalogue) return;

    elementCatalogue.innerHTML = ""; 

    for (let i = 0; i < produits.length; i++) {
        let produit = produits[i];
        
        let image1 = produit.images[0] || 'placeholder.jpg';
        let image2 = produit.images[1] || image1; 

        let carte = document.createElement('article');
        carte.className = 'product-card';

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

if (elementCatalogue) {
    recupererProduits();
    
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (filterButtons.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                const category = e.target.getAttribute('data-category');
                filtrerProduits(category);
            });
        });
    }
}

// Fonction de filtrage des produits
function filtrerProduits(category) {
    let produitsFiltres = [];
    if (category === 'all') {
        produitsFiltres = tousLesProduits;
    } else if (category === 'vetements') {
        produitsFiltres = tousLesProduits.filter(p => p.id.startsWith('q'));
    } else if (category === 'chaussures') {
        produitsFiltres = tousLesProduits.filter(p => p.id.startsWith('b'));
    }
    afficherLesProduits(produitsFiltres);
}