const photographersSection = document.querySelector(".photographer_section");

const url = "data/photographers.json";  // Je cree une constante avec l'url de mon fichier json , qui va me servir pour fetch

async function fetchData(url) {   // Methode fetch pour recuperer des data 
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const data = await response.json();     // transforme les data en format json
    return data;
  } catch (error) {
    console.error(error.message);
    return null; // Pour éviter que la fonction renvoie undefined en cas d'erreur
  }
}

async function displayPhotographers(photographers) {
  photographers.forEach((photographer) => {
    const photographerModel = photographerTemplate(photographer);
    const userCardDOM = photographerModel.getUserCardDOM();

    // Ajout du photographe à la section
    photographersSection.appendChild(userCardDOM);
  });

  // Récupérer toutes les divs .allContainer après que le DOM soit mis à jour
  const allContainers = document.querySelectorAll(".allContainer");

  // Variable pour suivre l'élément actif
  let currentIndex = 0;

  // Mettre le focus et la classe active sur le premier élément
  // if (allContainers.length > 0) {
  //   allContainers[currentIndex].focus();
  //   allContainers[currentIndex].classList.add("active");
  // }

  // Gestion de l'événement keydown pour naviguer entre les éléments avec les flèches
  document.addEventListener("keydown", (event) => {
    if (allContainers.length === 0) return;

    // Retirer la classe active de l'élément actuel et enlever le focus
    allContainers[currentIndex].classList.remove("active");
    allContainers[currentIndex].blur();

    // Navigation avec les flèches droite et gauche
    switch (event.key) {
      case "ArrowRight":// Flèche droite : Aller au prochain élément
        currentIndex = (currentIndex + 1 ) % allContainers.length;
        allContainers[currentIndex].focus();
        break;

      case "ArrowLeft": // Flèche gauche : Aller à l'élément précédent
        currentIndex = (currentIndex - 1 + allContainers.length) % allContainers.length;
        allContainers[currentIndex].focus();
        break;

      case "Enter": // Touche Entrée : Aller à la page du photographe sélectionné
        const selectedPhotographer = photographers[currentIndex];
        window.location.href = `photographer.html?id=${selectedPhotographer.id}`;
        break;

      default:
        return; // Ignorer les autres touches
    }

    // Ajouter la classe active à l'élément sélectionné et lui donner le focus
    allContainers[currentIndex].classList.add("active");
    allContainers[currentIndex].focus();

    // Empêcher le comportement par défaut des flèches
    event.preventDefault();
  });
}

// Fonction d'initialisation
async function init() {
  const { photographers } = await fetchData(url);
  displayPhotographers(photographers);  // Afficher les photographes après récupération des données
}

init();

document.addEventListener("keydown", (event) => { 
  if (event.key === "Tab") {
    event.preventDefault();  // Empêcher le comportement par défaut de la touche Tab
  }
});