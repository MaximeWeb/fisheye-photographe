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

// Je vien recuperer les data de mon ficher json avec la function fetchData + mon URL
async function getData() {
  const data = await fetchData(url);
  return data 
}

// Je crée maintenant une fonction qui va afficher les profils avec les photographe en parametres 
async function displayPhotographers(photographers) {
 
  photographers.forEach((photographer) => {             // forEach pour afficher plusieurs profils 
    const photographerModel = photographerTemplate(photographer);
    const userCardDOM = photographerModel.getUserCardDOM();  // on appelle la function getUserCardDom qui ce trouve dans la function photographerTemplate
    photographersSection.appendChild(userCardDOM);            // qui va nous permettre d'afficher le template autant de fois qu'il y'a de photographe 
  });                                                          // qui va apparaitre sous le parent photographerSection 
}

// Fonction d'initialisation
async function init() {
  const { photographers } = await getData();           // On vien indiquer le parametre de la function displayPhotographer qui va afficher les
  displayPhotographers(photographers);                  // data de mon ficher json 
}

init();




