// DOM ELEMENTS
const photographerHeader = document.querySelector(".parentBlocHeader");
const mediaSection = document.querySelector(".media_section"); 
const likesDiv = document.querySelector(".totalLikesDiv"); 
const totalLikesDiv = document.querySelector(".totalLikes"); 
const priceDiv = document.querySelector(".price"); 
const contentLikes = document.querySelector(".contentLikes"); 
const menuSelect = document.getElementById("menu-select");

// LIGHTBOX DOM ELEMENTS
const lightbox = document.querySelector(".lightbox");
const lightboxbg = document.querySelector(".bgroundLightbox");
const textChanged = document.querySelector(".textwillchange");
const buttonCloseLightbox = document.querySelector(".closeLightbox");
const arrowLeft = document.querySelector(".left");
const arrowRight = document.querySelector(".right");
// FORMULAIRE DOM ELEMENTS
const buttonCloseModal = document.querySelector(".closeModal")
const nameForm = document.querySelector(".name-photographe"); 
const form = document.querySelector("form");
const firstName = form.querySelector('input[name="first"]');
const lastName = form.querySelector('input[name="last"]');
const email = form.querySelector('input[name="email"]');
const message = form.querySelector('textarea[name="message"]');
const formDataElements = form.querySelectorAll(".formData");
const validated = document.querySelector(".validated p");
const modal = document.querySelector(".modal");
const modalbg = document.querySelector(".bground");
// URL FICHIER JSON
const url = "data/photographers.json";  

// Fetch JSON data
async function fetchData(url) { // Fetch qui va recupére mes data et les convertir en json
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Response status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(error.message);
    return null; 
  }
}

const urlParams = new URLSearchParams(window.location.search);   // je vien crée un nouvelle url windows 
const photographerId = urlParams.get('id');                   // et je recupere l'id de cette url 

// PHOTOGRAPHERS DATA

async function getPhotographerById(id) {                     // function qui va récupérer un id , on vien filtrer le tableau  pour récupéré l'id 
  const data = await fetchData(url);                            
  return data.photographers.find((photographer) => photographer.id === parseInt(id));
}

async function displayPhotographerData() {
  const photographer = await getPhotographerById(photographerId);       // ici on va comparé les id afin d'afficher les data du photographe  
  if (photographer) {
    const photographerModel = photographerTemplate(photographer);            // si l'id existe , on remplis les data de mon template avec celle du photographe
    const photographerDOM = photographerModel.displayDataPhotographer();      // en suite on va pouvoir inserer ces data dans le DOM
    photographerHeader.appendChild(photographerDOM);                         // son parent 

    // Add photographer name to form
    const nameDOM = photographerModel.nameFormTemplate();                  // ici on va récupérer uniquement le nom du photogtaphe pour l'afficher
    nameForm.appendChild(nameDOM);

    const priceDOM = photographerModel.pricePhotographer();                  // ici on va récupérer uniquement le nom du photogtaphe pour l'afficher
    priceDiv.appendChild(priceDOM);

  } else {
    console.error(`Photographer with ID ${photographerId} not found.`);
  }
}
displayPhotographerData();

// MEDIA PHOTOGRAPHERS DATA

async function getMediaByPhotographerId(photographerId) {            //ici une fonction qui va récupéré les media de mon tableau json media
  const data = await fetchData(url);
  return data.media.filter((media) => media.photographerId === parseInt(photographerId));
}

function buildImageLink(media, photographerName) {  // Ma fonction afin de récupéré la routes des assets , on viendra adapté le nom du photographe pour qu'il soit identique
  if (media.image) {
    return `assets/photographers/${photographerName}/${media.image}`;
  } else if (media.video) {
    return `assets/photographers/${photographerName}/${media.video}`;
  } else {
    console.error("Invalid media type", media);
    return '';
  }
}

async function updateLightboxContent(index) {     // Fonction pour mettre à jour le contenu de la lightbox
  const photographer = await getPhotographerById(photographerId);
  const stringName = photographer.name.toLowerCase().replace(" ", "");  // Adapte le nom du photographe pour le chemin des assets

  const currentMediaIndex = mediaItems[index]; // Média actuel basé sur l'index de mon array MediaItems
  const mediaLink = buildImageLink(currentMediaIndex, stringName); // on vien adapté le chemin de mes assets 

  lightbox.innerHTML = `             
    ${
      currentMediaIndex.video
        ? `<video controls>
        <source src="${mediaLink}" type="video/mp4">
        </video>`
        : `<img src="${mediaLink}" alt="Image ${currentMediaIndex.title}" />` // mon bloc html pour la ligthbox
    }
    <p>${currentMediaIndex.title}</p>
  `;
}

let currentMediaIndex = 0; // Index global pour suivre l'image courante dans la lightbox

function displayLightbox(index) {  // ouvre la lightbox + updateLigthbox qui demande en parametre un index pour afficher le bon media
  currentMediaIndex = index; // On vien définir l'index du current
  updateLightboxContent(currentMediaIndex); // On met a jour la lightbox avec ma fonction updateLightbox
  lightbox.style.display = "block";
  lightboxbg.style.display = "block";
  
}

function closeLightbox() { // ferme la ligthbox
  lightbox.style.display = "none";
  lightboxbg.style.display = "none";
}

// EventListener

buttonCloseLightbox.addEventListener("click", closeLightbox);

arrowLeft.addEventListener("click", () => { // Navigation à gauche ligthbox
  currentMediaIndex = (currentMediaIndex - 1 + mediaItems.length) % mediaItems.length; // Boucle au dernier élément si on atteint le début
  updateLightboxContent(currentMediaIndex);
});

arrowRight.addEventListener("click", () => {// Navigation à droite ligthbox
  currentMediaIndex = (currentMediaIndex + 1) % mediaItems.length;// Boucle au premier élément si on atteint la fin
  console.log(currentMediaIndex) 
  updateLightboxContent(currentMediaIndex);
});

menuSelect.addEventListener("change", modifCategories);

// AFFICHAGE DES MEDIAS

function setupMediaNavigation() {      // fonction afin de navigué avec les fleches via la classe onFocus
  const allMediaBlocksFocus = document.querySelectorAll(".onFocus"); // on recupere la classe onFocus
  let currentMediaIndex = 0; // Index de départ

  // Ajouter un listener global pour la navigation
  document.addEventListener("keydown", (event) => {
    if (allMediaBlocksFocus.length === 0) return;
    allMediaBlocksFocus[currentMediaIndex].blur();

    // Navigation avec les flèches droite et gauche
    switch (event.key) {
      case "ArrowRight": // Flèche droite : Aller au prochain média
        currentMediaIndex = (currentMediaIndex + 1) % allMediaBlocksFocus.length;
        break;

      case "ArrowLeft": // Flèche gauche : Aller au média précédent
        currentMediaIndex = (currentMediaIndex - 1 + allMediaBlocksFocus.length) % allMediaBlocksFocus.length;
        break;

      case "Enter": // Appuyez sur "Entrée" pour ouvrir la lightbox
        allMediaBlocksFocus[currentMediaIndex].click();
        return; // Terminer ici pour ne pas exécuter le focus supplémentaire
      default:
        return; 
    }

    // donner le focus au nouvel élément
    allMediaBlocksFocus[currentMediaIndex].focus();

    // Empêcher le comportement par défaut des flèches
    event.preventDefault();
  });
}

async function displayMedia(sortedMedia) {   // fonction que va affiché les media , et récuperer le bon index pour la ligthbox
  const photographer = await getPhotographerById(photographerId);
  const stringName = photographer.name.toLowerCase().replace(" ", "");  // j'arrange les noms des photographers into fichiers pour qu'ils soit identique a mon json

  const totalLikes = sortedMedia.reduce((acc, media) => acc + media.likes, 0); // ici on va affiché le nombre total des likes dans une div 
  contentLikes.textContent = totalLikes; 

 
  mediaSection.innerHTML = "";
  sortedMedia.forEach((media, index) => {                  // boucle pour afficher les media
    const mediaLink = buildImageLink(media, stringName);
    const mediaModel = mediaTemplate({ ...media, mediaLink });
    const mediaCardDOM = mediaModel.mediaDOM();

    // Ajouter chaque média à la section mediaSection
    mediaSection.appendChild(mediaCardDOM);

    const mediaElement = mediaCardDOM.querySelector("img, video");  

    // Ajouter l'événement pour afficher la lightbox
    mediaElement.addEventListener("click", () => {    
      displayLightbox(index); // Afficher la lightbox avec l'index du média
    });

    // Ajoute la classe onFocus aux médias pour la navigation
    mediaElement.classList.add("onFocus");
    mediaElement.setAttribute("tabindex", "0"); // Rendre navigable avec le clavier
  });

  // Mettre en place la navigation par clavier après affichage
  setupMediaNavigation();
}

async function modifCategories(event) {  // function qui Trie en fonction de la catégorie , et affiche le resultat
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

  mediaSection.innerHTML = "";

  // Affiche les médias triés
  displayMedia(sortedMedia);

  // Réinitialise l'index de la lightbox
  currentMediaIndex = 0;
}

let mediaItems = []

async function initialDisplayMedia() {    
   mediaItems = await getMediaByPhotographerId(photographerId);  // mediaItems recupere le tableau de getMediaByPhotographerId comme promesse
  const sortedByPopularity = mediaItems.sort((a, b) => b.likes - a.likes); // on tri le tableau par popularité initialement
  displayMedia(sortedByPopularity);
}
initialDisplayMedia();


// FORMULAIRE 

const originalTextChanged = textChanged.textContent;

function showError(input, message) { // fonction afin de faire apparaitre les messages d'erreur avec la classe css formData
  const formData = input.closest(".formData"); // on va chercher l'element le plus proche du parent formData , donc les input .
  formData.setAttribute("data-error", message); // setAttribute afin de recuperer l'attribut data-error + ajouté un message d'erreur
  formData.setAttribute("data-error-visible", "true"); // ici on va faire apparaitre l'emplacement du message d'erreur
}

function hideError(input) {// On va gérer le cas ou l'utilisateur est revenu sur le champ afin de modifier son erreur
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
  firstName.focus();
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
    closeEnter.focus()
  }
};

buttonCloseModal.addEventListener("click", () => {
  closeModal();
});

// Submit formulaire
form.addEventListener("submit", validate);

// Event Keydown

document.addEventListener("keydown", (event) => {  // Navigation fléché lightbox
  if (lightbox.style.display === "block") {
    if (event.key === "ArrowRight") {
      currentMediaIndex = (currentMediaIndex + 1) % mediaItems.length; 
      updateLightboxContent(currentMediaIndex); 
    } else if (event.key === "ArrowLeft") {
      currentMediaIndex = (currentMediaIndex - 1 + mediaItems.length) % mediaItems.length; 
      updateLightboxContent(currentMediaIndex);
    }
  }
});

document.addEventListener("keydown", (event) => {    // touche echap pour fermer les modals
  if (event.key === "Escape") {
    // Empêcher l'envoi du formulaire si l'utilisateur presse "Enter"
    closeModal()
    closeLightbox();
  } 
});

const  focusableElements =
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
const firstFocusableElement = modal.querySelectorAll(focusableElements)[0]; // get first element to be focused inside modal
const focusableContent = modal.querySelectorAll(focusableElements);
const lastFocusableElement = focusableContent[focusableContent.length - 1]; // get last element to be focused inside modal

document.addEventListener('keydown', function(e) {  // Navigation modal
  let isTabPressed = e.key === 'Tab' ;

  if (!isTabPressed) {
    return;
  }
  if (e.shiftKey) { // if shift key pressed for shift + tab combination
    if (document.activeElement === firstFocusableElement) {
      lastFocusableElement.focus(); // add focus for the last focusable element
      e.preventDefault();
    }
  } else { // if tab key is pressed
    if (document.activeElement === lastFocusableElement) { // if focused has reached to last focusable element then focus first focusable element after pressing tab
      firstFocusableElement.focus(); // add focus for the first focusable element
      e.preventDefault();
    }
  }
});

const closeEnter = document.querySelector(".closeEnter")

closeEnter.addEventListener("keydown", (event) => {
  // Vérifiez si la touche pressée est "Enter"
  if (event.key === "Enter") {
    console.log("Enter pressed on closeEnter");

    // Empêcher la propagation de l'événement pour éviter que le focus se déplace
    event.preventDefault(); 
    event.stopPropagation(); // Arrête la propagation de l'événement

    // Fermer la modal
    closeModal();  
  }
});

const contactButton = document.querySelector(".contact_button");
  
contactButton.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    hideAllErrors();
    displayModal();

    // Affiche le modal
    setTimeout(() => {
      const firstName = document.querySelector('input[name="first"]'); // Récupère l'input une fois le modal ajouté au DOM
      if (firstName) {
        firstName.focus(); // Applique le focus
      } else {
        console.error("L'élément firstName n'a pas été trouvé.");
      }
    }, 0); // Petite temporisation pour attendre que le modal soit rendu
  }
});
 
const buttonTri = document.querySelector(".select-style");

buttonTri.addEventListener("keydown", (event) => {
  // Vérifiez si la touche pressée est "Enter"
  if (event.key === "Enter") {
    // Simuler un clic sur l'élément select pour ouvrir le menu
    buttonTri.click();
  }
});

 





