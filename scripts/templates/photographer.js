const form = document.querySelector("form");
const firstName = form.querySelector('input[name="first"]');
const lastName = form.querySelector('input[name="last"]');
const email = form.querySelector('input[name="email"]');
const message = form.querySelector('textarea[name="message"]');
const formDataElements = form.querySelectorAll(".formData");
const validated = document.querySelector(".validated p");
const lightbox = document.querySelector(".lightbox");
const modal = document.querySelector(".modal");
const textChanged = document.querySelector(".textwillchange");
const modalbg = document.querySelector(".bground");
const lightboxbg = document.querySelector(".bgroundLightbox");
const buttonCloseLightbox = document.querySelector(".closeLightbox");
const arrowLeft = document.querySelector(".left");
const arrowRight = document.querySelector(".right");

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
// Fait apparaitre le formulaire
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

function photographerTemplate(data) {
  const { name, portrait, city, country, tagline, price, id } = data;

  const picture = `assets/PhotographersIDPhotos/${portrait}`;
  // INDEX.HTML     PHOTOS DE PROFIL + INFOS DES PHOTOGRAPHES
  function getUserCardDOM() {
    const article = document.createElement("article"); // j'utilise innerHtml pour inserer plusieurs elements html directement
    article.innerHTML = `    
        <div class="imgContainer">
       <a href="photographer.html?id=${id}">
          <img src="${picture}" alt="Photo de ${name}">
          <h2>${name}</h2>
          </a>
        </div>
        <h3>${city}, ${country}</h3>
        <h4>${tagline}</h4>
        <h5>${price}€/jour</h5>
      `;

    return article;
  }
  // PHOTOGRAPHER.HTML     HEADER  INFO DU PHOTOGRAPHE LIE A L ID DE L URL
  function displayDataPhotographer() {
    const article = document.createElement("article");
    article.innerHTML = `    
      <div class="textFlexbox" >
        <h2>${name}</h2>
        <h3>${city}, ${country}</h3>
        <h4>${tagline}</h4>
      </div>
      <button class="contact_button" onclick="displayModal()">Contactez-moi</button>  
      <div class="imgFlexbox" >
       <img class="imgPhoto" src="${picture}" alt="Photo de ${name}">
    </div>
      `;

    return article;
  }

  function nameFormTemplate() {
    const article = document.createElement("article");
    article.innerHTML = `    
        
        <p>${name}</p>
      `;

    return article;
  }

  return { getUserCardDOM, displayDataPhotographer, nameFormTemplate };
}

function mediaTemplate(data) {
  const { name, imageLink, title, likes } = data;
  let currentLikes = likes;

  const isVideo = imageLink.endsWith(".mp4"); // isVideo sera un fichier qui fini par mp4

  function mediaDOM() {
    const article = document.createElement("article");
    article.innerHTML = `
        <div class="blocMedia">
          ${
            // ternaire si c'est un fichier qui fini par mp4 on affiche la div Video
            isVideo
              ? `<div class="videoMedia">
              <video controls>
                   <source  src="${imageLink}" type="video/mp4">
                 </video>
                 </div>
                 ` // sinon on affiche la div image
              : `<img class="media" src="${imageLink}" alt="Photo de ${name}">`
          }
          <div class="blocTitleLikes">
            <h2>${title}</h2>
            <p>
              <span class="likesNumbers">${currentLikes}</span> 
              <i class="fa-regular fa-heart likeIcon"></i>
            </p>
          </div>
        </div>
      `;

    const likeIcon = article.querySelector(".likeIcon");
    const likesCount = article.querySelector(".likesNumbers");
    const imgMedia = article.querySelector(".media"); 
    const videoMedia = article.querySelector(".videoMedia video"); 
   
   
        // Gere le contenue de la lightbox
    function showMediaInLightbox(media, title ) {
      
      if (isVideo) {
        lightbox.innerHTML = `
          <video controls>
            <source src="${media}" type="video/mp4">
          </video>
          <p>${title}</p>
        `;
      } else {
        lightbox.innerHTML = `
          <img src="${media}" alt="${title}">
          <p>${title}</p>
        `;
      }
    }
        // Ajoute l'evenement d'ouverture de la Modale et indique le media de showmedia
    if (imgMedia) {
      imgMedia.addEventListener("click", () => {
        displayLightbox(); 
        showMediaInLightbox(imageLink, title); 
      });
    }

    if (videoMedia) {
      videoMedia.addEventListener("click", () => {
        displayLightbox(); 
        showMediaInLightbox(imageLink, title);
      });
    }
   

    buttonCloseLightbox.addEventListener("click", () => closeLightbox())

    
    // arrowLeft.addEventListener("click", () => navigateLightbox("prev"));
    // arrowRight.addEventListener("click", () => navigateLightbox("next"));


    likeIcon.addEventListener("click", () => {
      // event au click de l'icon heart , on ajouté +1 au click et -1 si on reclik
      if (likeIcon.classList.contains("fa-regular")) {
        // on change l'icon en fonction du click
        likeIcon.classList.remove("fa-regular");
        likeIcon.classList.add("fa-solid");
        currentLikes++;
      } else {
        likeIcon.classList.remove("fa-solid");
        likeIcon.classList.add("fa-regular");
        currentLikes--;
      }
      likesCount.textContent = currentLikes;
    });

    return article;
  }

  return { mediaDOM };
}


// FORMULAIRE 

const validate = (event) => {
  event.preventDefault(); 
  let isValid = true; 

  const nameRegex = /^[a-zA-ZÀ-ÿ '-]{2,}$/; 
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 

  const formData = new FormData(form); // Je crée un nouvelle objet iterable FormData qui aura comme param Key,Value
  const data = Object.fromEntries(formData.entries()); // Grace a .entries j'obtiens un iterateur et fromEntries pour le changer en objet js lisible
  console.log(data);

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
