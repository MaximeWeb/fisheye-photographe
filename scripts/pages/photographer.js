//    DOM ELEMENTS
const photographerHeader = document.querySelector(".photograph-header");
const mediaSection = document.querySelector(".media_section");   
const nameForm = document.querySelector(".name-photographe") ; 

const urlParams = new URLSearchParams(window.location.search);  // URLsearchParam pour analyser l'url 
const photographerId = urlParams.get('id');                      // .get pour recuperer le parametre choisi , ici l'ID

async function getPhotographerById(id) {          // ici on vien creer une fonction qui va recuperer un photographe grace a son ID
  const data = await fetchData(url);
  
  return data.photographers.find((photographer) => photographer.id === parseInt(id));   // .find va allez parcourir le tableau jusqu'a trouvé un ID
}


// async function getLikesData() {
//   const data = await fetchData(url);
//   const filteredData = data.media.filter((media) => media.likes > 0);
//   const sortedData = filteredData.sort((a, b) => b.likes - a.likes);
//   console.log(sortedData);
  
//   return sortedData; // Retourne les données triées si nécessaire
// }
// getLikesData()

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
  
  mediaSection.innerHTML = "";

  sortedMedia.forEach((media) => {
    const imageLink = buildImageLink(media, stringName); // Crée le lien vers l'image
    const mediaModel = mediaTemplate({ ...media, imageLink }); // Modèle du média
    const mediaCardDOM = mediaModel.mediaDOM(); // Génère le DOM pour chaque média
    mediaSection.appendChild(mediaCardDOM); // Ajoute au conteneur des médias
  });
}



// function pour trié en function de la categorie
async function modifCategories(event) {
  const categorie = event.target.value; // on récupere la valeur sélectionné dans le menu
  const mediaItems = await getMediaByPhotographerId(photographerId); // Récupère tous les médias liés au photographe

  let sortedMedia;
  switch (categorie) {
    case "popularité":
      sortedMedia = mediaItems.sort((a, b) => b.likes - a.likes); //  likes décroissant
      break;
    case "date":
      sortedMedia = mediaItems.sort((a, b) => new Date(b.date) - new Date(a.date)); //date décroissante
      break;
    case "titre":
      sortedMedia = mediaItems.sort((a, b) => a.title.localeCompare(b.title)); // Tri par ordre alphabetique
      break;
    default:
  }

  // Affiche les médias triés
  displayMedia(sortedMedia);
}

// Evenement Change 
const menuSelect = document.getElementById("menu-select");
menuSelect.addEventListener("change", modifCategories);

// Chargement initial des médias triés par popularité et affiche avec displayMedia
async function initialDisplayMedia() {
  const mediaItems = await getMediaByPhotographerId(photographerId);
  const sortedByPopularity = mediaItems.sort((a, b) => b.likes - a.likes);
  displayMedia(sortedByPopularity);
}

initialDisplayMedia();
displayPhotographerData();
// displayMedia();







