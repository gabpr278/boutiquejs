const CLE_PANIER = "zarabe_panier";

// Fonction pour récupérer le panier actuel
function obtenirPanier() {
    const panierTexte = localStorage.getItem(CLE_PANIER);
    if (panierTexte) {
        return JSON.parse(panierTexte);
    } else {
        return [];
    }
}

// Fonction pour sauvegarder le panier
function sauvegarderPanier(panier) {
    localStorage.setItem(CLE_PANIER, JSON.stringify(panier));
    mettreAJourCompteurPanier();
}

// Fonction pour ajouter un produit au panier
function ajouterAuPanier(produitAAjouter) {
    const panier = obtenirPanier();

    const indexProduitExistant = panier.findIndex(article => 
        article.id === produitAAjouter.id && 
        article.taille === produitAAjouter.taille && 
        article.variante === produitAAjouter.variante
    );

    if (indexProduitExistant !== -1) {
        panier[indexProduitExistant].quantite += 1;
    } else {
        produitAAjouter.quantite = 1;
        panier.push(produitAAjouter);
    }

    sauvegarderPanier(panier);
}

// Fonction pour mettre à jour le texte du bouton "PANIER (X)"
function mettreAJourCompteurPanier() {
    const panier = obtenirPanier();
    const boutonPanier = document.getElementById("btn-cart");
    
    if (boutonPanier) {
        let totalArticles = 0;
        for (let i = 0; i < panier.length; i++) {
            totalArticles += panier[i].quantite;
        }
        
        boutonPanier.innerText = "PANIER (" + totalArticles + ")";
        
        boutonPanier.style.cursor = "pointer";
        boutonPanier.onclick = function() {
            window.location.href = "panier.html";
        };
    }
}

document.addEventListener("DOMContentLoaded", mettreAJourCompteurPanier);
mettreAJourCompteurPanier();
