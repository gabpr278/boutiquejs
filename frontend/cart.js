// Fichier pour gérer la logique du panier avec le localStorage

// Clé utilisée pour stocker le panier dans la mémoire du navigateur
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
    mettreAJourCompteurPanier(); // On met à jour le compteur à chaque sauvegarde
}

// Fonction pour ajouter un produit au panier
function ajouterAuPanier(produitAAjouter) {
    const panier = obtenirPanier();

    // On cherche si ce produit exact (même id, même taille, même variante) est déjà dans le panier
    const indexProduitExistant = panier.findIndex(article => 
        article.id === produitAAjouter.id && 
        article.taille === produitAAjouter.taille && 
        article.variante === produitAAjouter.variante
    );

    if (indexProduitExistant !== -1) {
        // Le produit est déjà là, on augmente la quantité
        panier[indexProduitExistant].quantite += 1;
    } else {
        // Le produit n'y est pas, on l'ajoute avec une quantité de 1
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
        // On calcule le nombre total d'articles (en additionnant les quantités)
        let totalArticles = 0;
        for (let i = 0; i < panier.length; i++) {
            totalArticles += panier[i].quantite;
        }
        
        boutonPanier.innerText = "PANIER (" + totalArticles + ")";
        
        // Rendre le bouton cliquable et changer le curseur
        boutonPanier.style.cursor = "pointer";
        boutonPanier.onclick = function() {
            window.location.href = "panier.html";
        };
    }
}

// Au chargement de la page (ou du script), on met à jour le compteur
document.addEventListener("DOMContentLoaded", mettreAJourCompteurPanier);
// S'il n'y a pas d'événement DOMContentLoaded (car déjà chargé), on l'exécute directement
mettreAJourCompteurPanier();
