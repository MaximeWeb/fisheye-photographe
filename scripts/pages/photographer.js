// DOM ELEMENTS
const photographerHeader = document.querySelector(".photograph-header");
const mediaSection = document.querySelector(".media_section"); 
const nameForm = document.querySelector(".name-photographe"); 
const form = document.querySelector("form");
const firstName = form.querySelector('input[name="first"]');
const lastName = form.querySelector('input[name="last"]');
const email = form.querySelector('input[name="email"]');
const message = form.querySelector('textarea[name="message"]');
const formDataElements = form.querySelectorAll(".formData");
const menuSelect = document.getElementById("menu-select");
const validated = document.querySelector(".validated p");
const modal = document.querySelector(".modal");
const modalbg = document.querySelector(".bground");
const lightbox = document.querySelector(".lightbox");
const lightboxbg = document.querySelector(".bgroundLightbox");
const textChanged = document.querySelector(".textwillchange");
const buttonCloseLightbox = document.querySelector(".closeLightbox");
const arrowLeft = document.querySelector(".left");
const arrowRight = document.querySelector(".right");

const url = "data/photographers.json";  // JSON data file path

// Fetch JSON data
async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Response status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(error.message);
    return null; 
  }
}

// Get photographer ID from URL parameters
const urlParams = new URLSearchParams(window.location.search); 
const photographerId = urlParams.get('id'); 

// Get photographer by ID
async function getPhotographerById(id) {
  const data = await fetchData(url);
  return data.photographers.find((photographer) => photographer.id === parseInt(id));
}

// Display photographer data
async function displayPhotographerData() {
  const photographer = await getPhotographerById(photographerId);
  if (photographer) {
    const photographerModel = photographerTemplate(photographer);
    const photographerDOM = photographerModel.displayDataPhotographer();
    photographerHeader.appendChild(photographerDOM);

    // Add photographer name to form
    const nameDOM = photographerModel.nameFormTemplate();
    nameForm.appendChild(nameDOM);
  } else {
    console.error(`Photographer with ID ${photographerId} not found.`);
  }
}
displayPhotographerData();

// Get media by photographer ID
async function getMediaByPhotographerId(photographerId) {
  const data = await fetchData(url);
  return data.media.filter((media) => media.photographerId === parseInt(photographerId));
}

// Build media file link
function buildImageLink(media, photographerName) {
  return `assets/photographers/${photographerName}/${media.image || media.video}`;
}


let mediaItems = []; // Store media data for current photographer
let currentMediaIndex = 0; // Index for current media in lightbox
// Populate modal data
function switchLightbox(currentTitle) {
  const res = mediaItems.findIndex(media => media.title === currentTitle);
  return {
    current: mediaItems[res],
    next: mediaItems[res + 1] || mediaItems[0],
    previous: mediaItems[res - 1] || mediaItems[mediaItems.length - 1],
  };
}

// Handle lightbox navigation
arrowLeft.addEventListener("click", () => {
  const previousTitle = lightbox.dataset.previousTitle;
  updateLightboxContent(previousTitle);
});

arrowRight.addEventListener("click", () => {
  const nextTitle = lightbox.dataset.nextTitle;
  updateLightboxContent(nextTitle);
});

// Update lightbox content
async function updateLightboxContent(currentTitle) {
  const { current, next, previous } = switchLightbox(currentTitle);
  const photographer = await getPhotographerById(photographerId);
  const stringName = photographer.name.toLowerCase().replace(" ", "");
  const mediaLink = buildImageLink(current, stringName);

  lightbox.innerHTML = `
    ${
      current.video
        ? `<video controls><source src="${mediaLink}" type="video/mp4"></video>`
        : `<img src="${mediaLink}" alt="${current.title}" />`
    }
    <p>${current.title}</p>
  `;

  lightbox.dataset.currentTitle = current.title;
  lightbox.dataset.nextTitle = next.title;
  lightbox.dataset.previousTitle = previous.title;
}

// Display lightbox
function displayLightbox() {
  lightbox.style.display = "block";
  lightboxbg.style.display = "block";
}

// Close lightbox
function closeLightbox() {
  lightbox.style.display = "none";
  lightboxbg.style.display = "none";
}

buttonCloseLightbox.addEventListener("click", closeLightbox);

// Display media
async function displayMedia(sortedMedia) {
  const photographer = await getPhotographerById(photographerId);
  const stringName = photographer.name.toLowerCase().replace(" ", "");

  mediaSection.innerHTML = ""; // Clear previous content

  sortedMedia.forEach((media) => {
    const imageLink = buildImageLink(media, stringName);
    const mediaModel = mediaTemplate({ ...media, imageLink });
    const mediaCardDOM = mediaModel.mediaDOM();

    mediaSection.appendChild(mediaCardDOM);

    const mediaElement = mediaCardDOM.querySelector("img, video");

    mediaElement.addEventListener("click", () => {
      updateLightboxContent(media.title);
      displayLightbox();
    });
  });
}

// Sort and filter media
async function modifCategories(event) {
  const categorie = event.target.value; // Récupère la catégorie sélectionnée
  let sortedMedia = await getMediaByPhotographerId(photographerId); // Récupère tous les médias liés au photographe

  // Trie les médias en fonction de la catégorie choisie
  switch (categorie) {
    case "popularité":
      sortedMedia.sort((a, b) => b.likes - a.likes);
      break;
    case "date":
      sortedMedia.sort((a, b) => new Date(b.date) - new Date(a.date));
      break;
    case "titre":
      sortedMedia.sort((a, b) => a.title.localeCompare(b.title));
      break;
    default:
      break;
  }

  // Met à jour la variable globale mediaItems avec les médias triés
  mediaItems = sortedMedia;

  // Affiche les médias triés
  displayMedia(sortedMedia);

  // Réinitialise l'index de la lightbox
  currentMediaIndex = 0;
}

menuSelect.addEventListener("change", modifCategories);

// Initial media display sorted by popularity
async function initialDisplayMedia() {
  mediaItems = await getMediaByPhotographerId(photographerId);
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










