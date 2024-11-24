const lightbox = document.querySelector(".lightbox");
const lightboxbg = document.querySelector(".bgroundLightbox");
const buttonCloseLightbox = document.querySelector(".closeLightbox");

  
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
 
  const array = [ name, imageLink, title, likes ]

  ;
  // console.log(array)
 
  
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


    if (imgMedia) {
        imgMedia.addEventListener("click", () => {
          displayLightbox(); 
          showMediaInLightbox(); 
          // console.log(imageLink)
        });
      }
  
      if (videoMedia) {
        videoMedia.addEventListener("click", () => {
          displayLightbox(); 
          showMediaInLightbox();
          // console.log(imageLink)
        });
      }

  // LIKES //
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
        // Gere le contenue de la lightbox
    function showMediaInLightbox() {
    lightbox.innerHTML = `
      ${
        isVideo
          ? `
          <video controls>
               <source  src="${imageLink}" type="video/mp4">
             </video>
             </div>
             ` // sinon on affiche la div image
          : `<img class="media" src="${imageLink}" alt="Photo de ${name}">`
      }`;
    
    }
   
    //     // Ajoute l'evenement d'ouverture de la Modale et indique le media de showmedia
    //
   

    buttonCloseLightbox.addEventListener("click", () => closeLightbox())

    
    // arrowLeft.addEventListener("click", () => navigateLightbox("prev"));
    // arrowRight.addEventListener("click", () => navigateLightbox("next"));
  
  return { mediaDOM };
}


