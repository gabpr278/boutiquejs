const URL_API = "http://localhost:3000/products";

// On récupère les éléments HTML où on va injecter les données
const imageProduit = document.getElementById('image-produit');
const nomProduit = document.getElementById('nom-produit');
const prixProduit = document.getElementById('prix-produit');
const descriptionProduit = document.getElementById('description-produit');
const conteneurVariantes = document.getElementById('conteneur-variantes'); // Nouveau conteneur pour les boutons
const conteneurProduit = document.getElementById('product-content');
const messageChargement = document.getElementById('loading-message');

// Fonction pour récupérer l'ID du produit depuis l'URL (ex: produit.html?id=q1)
function obtenirIdDansURL() {
    const parametres = new URLSearchParams(window.location.search);
    return parametres.get("id");
}

// Fonction pour charger et afficher le bon produit
async function afficherLeProduit() {
    const idDuProduit = obtenirIdDansURL();

    if (!idDuProduit) {
        messageChargement.innerText = "Aucun produit sélectionné.";
        return;
    }

    try {
        // On récupère tous les produits du backend
        const reponse = await fetch(URL_API);
        if (!reponse.ok) {
            console.log("Erreur serveur");
            return;
        }
        
        const listeDesProduits = await reponse.json();
        
        // On cherche le produit qui correspond à l'ID
        let produitChoisi = null;
        for (let i = 0; i < listeDesProduits.length; i++) {
            if (listeDesProduits[i].id === idDuProduit) {
                produitChoisi = listeDesProduits[i];
                break;
            }
        }

        if (produitChoisi) {
            // On cache le message de chargement et on affiche le contenu
            messageChargement.style.display = "none";
            conteneurProduit.style.display = "flex";

            // On remplit les informations textuelles
            nomProduit.innerText = produitChoisi.name;
            prixProduit.innerText = produitChoisi.price + " " + produitChoisi.currency;
            descriptionProduit.innerText = produitChoisi.description;

            // On met la première image par défaut
            imageProduit.src = produitChoisi.images[0] || 'placeholder.jpg';

            // On gère les variantes avec des boutons texte
            conteneurVariantes.innerHTML = ""; // on vide le conteneur au cas où

            if (produitChoisi.variants && produitChoisi.variants.length > 0) {
                for (let j = 0; j < produitChoisi.variants.length; j++) {
                    let variante = produitChoisi.variants[j];
                    
                    // On crée un bouton pour chaque variante
                    let bouton = document.createElement("button");
                    bouton.className = "bouton-variante";
                    bouton.innerText = variante.name; // Le texte du bouton sera "Classique" ou "Variante 1"

                    // Le premier bouton est actif par défaut
                    if (j === 0) {
                        bouton.classList.add("actif");
                    }

                    // Quand on clique sur le bouton, on change l'image
                    bouton.onclick = function() {
                        imageProduit.src = variante.image;
                        
                        // On enlève la classe 'actif' de tous les boutons
                        let tousLesBoutons = conteneurVariantes.getElementsByTagName("button");
                        for (let k = 0; k < tousLesBoutons.length; k++) {
                            tousLesBoutons[k].classList.remove("actif");
                        }
                        
                        // On ajoute la classe 'actif' sur le bouton cliqué
                        bouton.classList.add("actif");
                    };

                    conteneurVariantes.appendChild(bouton);
                }
            } else {
                // S'il n'y a pas de variantes
                conteneurVariantes.innerHTML = "<p>Modèle unique</p>";
            }

            // Gestion de l'ajout au panier
            const boutonAjouterPanier = document.getElementById('btn-add-cart');
            if (boutonAjouterPanier) {
                boutonAjouterPanier.addEventListener('click', function() {
                    // On récupère la taille sélectionnée
                    const boutonTailleActif = document.querySelector('.bouton-taille.actif');
                    const taille = boutonTailleActif ? boutonTailleActif.innerText : "";

                    // On récupère la variante sélectionnée
                    const boutonVarianteActif = document.querySelector('.bouton-variante.actif');
                    const variante = boutonVarianteActif ? boutonVarianteActif.innerText : "Classique";

                    // On prépare l'objet produit à sauvegarder
                    const article = {
                        id: produitChoisi.id,
                        nom: produitChoisi.name,
                        prix: produitChoisi.price,
                        image: imageProduit.src,
                        taille: taille,
                        variante: variante
                    };

                    // On appelle la fonction de cart.js
                    if (typeof ajouterAuPanier === "function") {
                        ajouterAuPanier(article);
                        
                        // Feedback visuel
                        const texteOriginal = boutonAjouterPanier.innerText;
                        boutonAjouterPanier.innerText = "Ajouté ! ✓";
                        boutonAjouterPanier.style.backgroundColor = "green";
                        
                        setTimeout(() => {
                            boutonAjouterPanier.innerText = texteOriginal;
                            boutonAjouterPanier.style.backgroundColor = "black";
                        }, 2000);
                    }
                });
            }

        } else {
            messageChargement.innerText = "Produit introuvable.";
        }
        
    } catch (erreur) {
        console.log("Erreur de chargement :", erreur);
        messageChargement.innerText = "Erreur de connexion au serveur.";
    }
}

// Fonction pour gérer la sélection de la taille
function gererSelectionTaille() {
    // On récupère tous les boutons de taille
    const boutonsTaille = document.querySelectorAll('.bouton-taille');

    // On fait une boucle sur chaque bouton
    for (let i = 0; i < boutonsTaille.length; i++) {
        let bouton = boutonsTaille[i];

        // On ajoute un événement au clic
        bouton.addEventListener('click', function() {
            // 1. On enlève la classe "actif" de tous les boutons
            for (let j = 0; j < boutonsTaille.length; j++) {
                boutonsTaille[j].classList.remove('actif');
            }

            // 2. On ajoute la classe "actif" uniquement sur le bouton cliqué
            bouton.classList.add('actif');
        });
    }
}

// On démarre l'affichage
afficherLeProduit();
// On démarre la logique des tailles
gererSelectionTaille();
