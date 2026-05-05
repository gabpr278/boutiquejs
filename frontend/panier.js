// Fichier pour gérer l'affichage et les actions sur la page Panier

const conteneurArticles = document.getElementById('cart-items');
const messagePanierVide = document.getElementById('empty-cart-message');
const resumePanier = document.getElementById('cart-summary');
const texteTotalPanier = document.getElementById('cart-total');

// Fonction pour afficher les articles du panier
function afficherPanier() {
    // Obtenir le panier depuis le localStorage (grâce à cart.js)
    const panier = obtenirPanier();

    // Vider le conteneur actuel
    conteneurArticles.innerHTML = "";

    // Si le panier est vide
    if (panier.length === 0) {
        messagePanierVide.style.display = "block";
        resumePanier.style.display = "none";
        return;
    }

    // Si le panier contient des articles
    messagePanierVide.style.display = "none";
    resumePanier.style.display = "block";

    let prixTotal = 0;

    // Créer le HTML pour chaque article
    for (let i = 0; i < panier.length; i++) {
        let article = panier[i];
        
        // Calcul du total
        let prixArticle = parseFloat(article.prix) || 0;
        prixTotal += prixArticle * article.quantite;

        let divArticle = document.createElement('div');
        divArticle.style.display = "flex";
        divArticle.style.alignItems = "center";
        divArticle.style.gap = "20px";
        divArticle.style.border = "1px solid #eee";
        divArticle.style.padding = "10px";
        divArticle.style.borderRadius = "8px";

        divArticle.innerHTML = `
            <img src="${article.image}" alt="${article.nom}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 4px;">
            
            <div style="flex: 1;">
                <h3 style="margin: 0; font-size: 16px;">${article.nom}</h3>
                <p style="margin: 5px 0; color: #555; font-size: 14px;">Modèle: ${article.variante} | Taille: ${article.taille}</p>
                <p style="margin: 0; font-weight: bold;">${article.prix} €</p>
            </div>
            
            <div style="display: flex; align-items: center; gap: 10px;">
                <button onclick="changerQuantite(${i}, -1)" style="width: 30px; height: 30px; background: #f0f0f0; border: none; cursor: pointer; border-radius: 4px;">-</button>
                <span style="font-weight: bold; width: 20px; text-align: center;">${article.quantite}</span>
                <button onclick="changerQuantite(${i}, 1)" style="width: 30px; height: 30px; background: #f0f0f0; border: none; cursor: pointer; border-radius: 4px;">+</button>
            </div>
            
            <button onclick="supprimerArticle(${i})" style="padding: 8px 12px; background: #ff4d4d; color: white; border: none; cursor: pointer; border-radius: 4px;">Supprimer</button>
        `;

        conteneurArticles.appendChild(divArticle);
    }

    // Mettre à jour le prix total
    texteTotalPanier.innerText = prixTotal.toFixed(2);
}

// Fonction pour modifier la quantité d'un article
function changerQuantite(index, changement) {
    const panier = obtenirPanier();
    
    // Mettre à jour la quantité
    panier[index].quantite += changement;
    
    // Si la quantité tombe à 0, on supprime l'article
    if (panier[index].quantite <= 0) {
        panier.splice(index, 1);
    }
    
    // Sauvegarder et réafficher
    sauvegarderPanier(panier);
    afficherPanier();
}

// Fonction pour supprimer complètement un article
function supprimerArticle(index) {
    const panier = obtenirPanier();
    
    // Supprimer l'élément à l'index donné
    panier.splice(index, 1);
    
    // Sauvegarder et réafficher
    sauvegarderPanier(panier);
    afficherPanier();
}

// Afficher le panier au chargement de la page
afficherPanier();
