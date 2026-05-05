const URL_API = "http://localhost:3000/products";

const imageProduit = document.getElementById('image-produit');
const nomProduit = document.getElementById('nom-produit');
const prixProduit = document.getElementById('prix-produit');
const descriptionProduit = document.getElementById('description-produit');
const conteneurVariantes = document.getElementById('conteneur-variantes');
const conteneurProduit = document.getElementById('product-content');
const messageChargement = document.getElementById('loading-message');

// Fonction pour récupérer l'ID du produit depuis l'URL
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
        const reponse = await fetch(URL_API);
        if (!reponse.ok) {
            console.log("Erreur serveur");
            return;
        }
        
        const listeDesProduits = await reponse.json();
        
        let produitChoisi = null;
        for (let i = 0; i < listeDesProduits.length; i++) {
            if (listeDesProduits[i].id === idDuProduit) {
                produitChoisi = listeDesProduits[i];
                break;
            }
        }

        if (produitChoisi) {
            messageChargement.style.display = "none";
            conteneurProduit.style.display = "flex";

            nomProduit.innerText = produitChoisi.name;
            prixProduit.innerText = produitChoisi.price + " " + produitChoisi.currency;
            descriptionProduit.innerText = produitChoisi.description;

            imageProduit.src = produitChoisi.images[0] || 'placeholder.jpg';

            conteneurVariantes.innerHTML = "";

            if (produitChoisi.variants && produitChoisi.variants.length > 0) {
                for (let j = 0; j < produitChoisi.variants.length; j++) {
                    let variante = produitChoisi.variants[j];
                    
                    let bouton = document.createElement("button");
                    bouton.className = "bouton-variante";
                    bouton.innerText = variante.name;

                    if (j === 0) {
                        bouton.classList.add("actif");
                    }

                    bouton.onclick = function() {
                        imageProduit.src = variante.image;
                        
                        let tousLesBoutons = conteneurVariantes.getElementsByTagName("button");
                        for (let k = 0; k < tousLesBoutons.length; k++) {
                            tousLesBoutons[k].classList.remove("actif");
                        }
                        
                        bouton.classList.add("actif");
                    };

                    conteneurVariantes.appendChild(bouton);
                }
            } else {
                conteneurVariantes.innerHTML = "<p>Modèle unique</p>";
            }

            const boutonAjouterPanier = document.getElementById('btn-add-cart');
            if (boutonAjouterPanier) {
                boutonAjouterPanier.addEventListener('click', function() {
                    const boutonTailleActif = document.querySelector('.bouton-taille.actif');
                    const taille = boutonTailleActif ? boutonTailleActif.innerText : "";

                    const boutonVarianteActif = document.querySelector('.bouton-variante.actif');
                    const variante = boutonVarianteActif ? boutonVarianteActif.innerText : "Classique";

                    const article = {
                        id: produitChoisi.id,
                        nom: produitChoisi.name,
                        prix: produitChoisi.price,
                        image: imageProduit.src,
                        taille: taille,
                        variante: variante
                    };

                    if (typeof ajouterAuPanier === "function") {
                        ajouterAuPanier(article);
                        
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
    const boutonsTaille = document.querySelectorAll('.bouton-taille');

    for (let i = 0; i < boutonsTaille.length; i++) {
        let bouton = boutonsTaille[i];

        bouton.addEventListener('click', function() {
            for (let j = 0; j < boutonsTaille.length; j++) {
                boutonsTaille[j].classList.remove('actif');
            }

            bouton.classList.add('actif');
        });
    }
}

afficherLeProduit();
gererSelectionTaille();
