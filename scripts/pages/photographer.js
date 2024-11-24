//    DOM ELEMENTS
const photographerHeader = document.querySelector(".photograph-header");
const mediaSection = document.querySelector(".media_section"); 
const mediaSectionImg = document.querySelector(".media_section img");     
const nameForm = document.querySelector(".name-photographe") ; 
const form = document.querySelector("form");
const firstName = form.querySelector('input[name="first"]');
const lastName = form.querySelector('input[name="last"]');
const email = form.querySelector('input[name="email"]');
const message = form.querySelector('textarea[name="message"]');
const formDataElements = form.querySelectorAll(".formData");
const validated = document.querySelector(".validated p");
const modal = document.querySelector(".modal");
const textChanged = document.querySelector(".textwillchange");
const modalbg = document.querySelector(".bground");
// const imgMedia = document.querySelector(".media"); 
// const videoMedia = document.querySelector(".videoMedia video"); 
const lightbox = document.querySelector(".lightbox");
const lightboxbg = document.querySelector(".bgroundLightbox");
const buttonCloseLightbox = document.querySelector(".closeLightbox");


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

const urlParams = new URLSearchParams(window.location.search);  // URLsearchParam pour analyser l'url 
const photographerId = urlParams.get('id');                      // .get pour recuperer le parametre choisi , ici l'ID


// Ouvre la lightbox
function displayLightbox() {
  lightbox.style.display = "block";
  lightboxbg.style.display = "block";
}
// ferme la lightbox
function closeLightbox() {
  lightbox.style.display = "none";
  lightboxbg.style.display = "none";
}




buttonCloseLightbox.addEventListener("click", () => closeLightbox())

async function getPhotographerById(id) {          // ici on vien creer une fonction qui va recuperer un photographe grace a son ID
  const data = await fetchData(url);
  
  return data.photographers.find((photographer) => photographer.id === parseInt(id));   // .find va allez parcourir le tableau jusqu'a trouvé un ID
}

// Afficher les informations du photographe
async function displayPhotographerData() {                            // Maintenant on va afficher les info du photographe en fonction de l'id
  const photographer = await getPhotographerById(photographerId);     // on crée une variable qui est egal a l'id de l'url
  if (photographer) {                                                    
    const photographerModel = photographerTemplate(photographer);         // ici on va précisé a notre function photographerTemplate quel data on souhaite
    const photographerDOM = photographerModel.displayDataPhotographer();          // et donc les afficher dans notre template 
    photographerHeader.appendChild(photographerDOM);                                 // sous son parent 
  
  } else {
    console.error(`Le photographe avec l'ID ${photographerId} n'a pas été retrouvé`);
  }
  const photographerModel = photographerTemplate(photographer);              // On vien recuperer le nom du photographe en fonction de l'id pour le form
  const photographerDOM = photographerModel.nameFormTemplate();
  nameForm.appendChild(photographerDOM);
}

displayPhotographerData();


async function getMediaByPhotographerId(photographerId) {       // ici on vien creer une fonction qui va recupérer des media via l'id du photographer
  const data = await fetchData(url);
   return data.media.filter((media) => media.photographerId === parseInt(photographerId));  // on utilise filter car il y'a plusieurs element a recuperer
}


function buildImageLink(media, photographerName) {    // je créer une fonction pour recupérer les images qui ce trouve dans un dossier asset   
  return `assets/photographers/${photographerName}/${media.image || media.video}` // avec les data du fichier json
}          

// Affiche les Medias 
async function displayMedia(sortedMedia) {
  const photographer = await getPhotographerById(photographerId); // Récupère les infos du photographe
  const stringName = photographer.name.toLowerCase().replace(" ", ""); // Adapter le nom pour le chemin du dossier

  mediaSection.innerHTML = ""; // Efface le contenu précédent

  sortedMedia.forEach((media, index) => {
    const imageLink = buildImageLink(media, stringName); // Crée le lien vers l'image
    const mediaModel = mediaTemplate({ ...media, imageLink }); // Modèle du média
    const mediaCardDOM = mediaModel.mediaDOM(); // Génère le DOM pour chaque média
  
    mediaSection.appendChild(mediaCardDOM); // Ajoute au conteneur des médias
  
    // Ajoute un événement pour afficher le média dans la lightbox
    mediaCardDOM.addEventListener("click", () => {
      currentMediaIndex = index;
      console.log(index) // Met à jour l'index courant
      displayLightbox(); // Ouvre la lightbox
      updateLightboxContent(); // Affiche le contenu de la lightbox
    });
  });
}



// function pour trié en function de la categorie
async function modifCategories(event) {
  const categorie = event.target.value; // on récupère la valeur sélectionnée dans le menu
  let mediaItems = await getMediaByPhotographerId(photographerId); // Récupère tous les médias liés au photographe

  let sortedMedia;
  switch (categorie) {
    case "popularité":
      sortedMedia = mediaItems.sort((a, b) => b.likes - a.likes); 
      console.log(mediaItems)
      break;
    case "date":
      sortedMedia = mediaItems.sort((a, b) => new Date(b.date) - new Date(a.date));
      console.log(mediaItems)
      break;
    case "titre":
      sortedMedia = mediaItems.sort((a, b) => a.title.localeCompare(b.title));
      console.log(mediaItems)
      break;
    default:
      
  }

  // Mettez à jour mediaItems avec le tableau trié
  
  
  // Affiche les médias triés
  displayMedia(sortedMedia);
  
  // Réinitialise l'index du média courant pour ne pas rester sur un ancien index
  currentMediaIndex = 0; // Réinitialise l'index de la lightbox
}


function resetCurrentMedia() {
  currentMediaIndex = 0
}

let mediaItems = []; // Pour stocker les médias liés au photographe

let currentMediaIndex = 0;


async function updateLightboxContent() {
  if (mediaItems.length > 0) {
    const currentMedia = mediaItems[currentMediaIndex];
    const photographer = await getPhotographerById(photographerId);
    const stringName = photographer.name.toLowerCase().replace(" ", "");
    const mediaLink = buildImageLink(currentMedia, stringName);

    lightbox.innerHTML = `
      ${
        currentMedia.video
          ? `<video controls><source src="${mediaLink}" type="video/mp4"></video>`
          : `<img src="${mediaLink}" alt="${currentMedia.title}" />`
      }
      <p>${currentMedia.title}</p>
    `;
  }
}

async function switchPicModal(direction) {
  if (mediaItems.length === 0) {
    mediaItems = await getMediaByPhotographerId(photographerId);
  }

  if (direction === "next") {
    currentMediaIndex = (currentMediaIndex + 1) % mediaItems.length;
  } else if (direction === "previous") {
    currentMediaIndex = (currentMediaIndex - 1 + mediaItems.length) % mediaItems.length;
  }

  updateLightboxContent(); // Met à jour le contenu de la lightbox
}

const arrowLeft = document.querySelector(".left");
const arrowRight = document.querySelector(".right");

arrowLeft.addEventListener("click", () => switchPicModal("previous"));
arrowRight.addEventListener("click", () => switchPicModal("next"));



// Evenement Change 
const menuSelect = document.getElementById("menu-select");
menuSelect.addEventListener("change", modifCategories, resetCurrentMedia);

// Affichage initial des médias triés par popularité et affiche avec displayMedia
async function initialDisplayMedia() {
  mediaItems = await getMediaByPhotographerId(photographerId); // Récupère les médias et les stocke
  const sortedByPopularity = mediaItems.sort((a, b) => b.likes - a.likes);
  displayMedia(sortedByPopularity);
}

initialDisplayMedia();



// FORMULAIRE 

const originalTextChanged = textChanged.textContent;



function showError(input, message) {
  // fonction afin de faire apparaitre les messages d'erreur avec la classe css formData
  const formData = input.closest(".formData"); // on va chercher l'element le plus proche du parent formData , donc les input .
  formData.setAttribute("data-error", message); // setAttribute afin de recuperer l'attribut data-error + ajouté un message d'erreur
  formData.setAttribute("data-error-visible", "true"); // ici on va faire apparaitre l'emplacement du message d'erreur
}

function hideError(input) {
  // On va gérer le cas ou l'utilisateur est revenu sur le champ afin de modifier son erreur
  const formData = input.closest(".formData");
  formData.setAttribute("data-error-visible", "false");
  formData.setAttribute("data-error", "");
}

function hideAllErrors() {
  formDataElements.forEach((formData) => {
    formData.setAttribute("data-error-visible", "false"); // Cache le message d'erreur
    formData.setAttribute("data-error", ""); // Efface le texte du message d'erreur
  });
}

function displayModal() {
  const modal = document.getElementById("contact_modal");
  modal.style.display = "block";
  modalbg.style.display = "block";
}
// Ferme le formulaire
function closeModal() {
  const modal = document.getElementById("contact_modal");
  modal.style.display = "none";
  form.classList.remove("hidden");
  hideAllErrors();

  textChanged.textContent = originalTextChanged;    // Mrssage de validation . 
  textChanged.style.fontSize = "64px";
}

const validate = (event) => {
  event.preventDefault(); 
  let isValid = true; 

  const nameRegex = /^[a-zA-ZÀ-ÿ '-]{2,}$/; 
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 

  const formData = new FormData(form); // Je crée un nouvelle objet iterable FormData qui aura comme param Key,Value
  
  for (const [key, value] of formData.entries()) {
    // for of pour agir sur plusieur champs sous forme de boucle avec les param key,value
    switch (
      key // switch pour eviter les répétition if if if avec le param key
    ) {
      case "first": // case qui fonctionne avec switch " dans le cas ou la clef s'apelle first ..ect"
        if (!nameRegex.test(value.trim())) {
          // .trim pour que les espace ne soit pas compter comme des characteres , .test methode de verification du regex
          showError(
            firstName,
            "Veuillez entrer un prénom valide (2 caractères minimum)."
          ); // fonction showError + input + message
          isValid = false;
        } else {
          hideError(firstName);
        }
        break;

      case "last":
        if (!nameRegex.test(value.trim())) {
          showError(
            lastName,
            "Veuillez entrer un nom valide (2 caractères minimum)."
          );
          isValid = false;
        } else {
          hideError(lastName);
        }
        break;

      case "email":
        if (!emailRegex.test(value.trim())) {
          showError(email, "Veuillez entrer une adresse e-mail valide.");
          isValid = false;
        } else {
          hideError(email);
        }
        break;

      case "message":
        if (value.length < 2 || value.length > 150) {
          showError(message, "Veuillez ecrire un message ");
          isValid = false;
        } else {
          hideError(message);
        }
        break;

      default:
        break;
    }
  }

  if (isValid) {
    form.reset();
    form.classList.add("hidden");
    textChanged.textContent = "Votre formulaire a été envoyé a ";
    textChanged.style.fontSize = "22px";
  }
};


document.querySelector(".closeModal").addEventListener("click", () => {
  closeModal();
});



// Submit formulaire
form.addEventListener("submit", validate);










