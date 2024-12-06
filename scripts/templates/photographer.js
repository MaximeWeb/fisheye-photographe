function photographerTemplate(data) {     // Template des data PHOTOGRAPHERS et structure du html
  const { name, portrait, city, country, tagline, price, id } = data;
  
  const picture = `assets/PhotographersIDPhotos/${portrait}`;
  // INDEX.HTML     PHOTOS DE PROFIL + INFOS DES PHOTOGRAPHES
  function getUserCardDOM() {
    const article = document.createElement("article"); // j'utilise innerHtml pour inserer plusieurs elements html directement
    article.innerHTML = ` 
    <div class="allContainer tabindex="0">   
        <div class="imgContainer">
       <a href="photographer.html?id=${id}" aria-label="lien pour afficher les medias">
          <img src="${picture}" alt="Photo de ${name}">
          <h2>${name}</h2>
          </a>
        </div>
        <h3>${city}, ${country}</h3>
        <h4>${tagline}</h4>
        <h5>${price}€/jour</h5>
        </div>
      `;
    return article;
  }
  // PHOTOGRAPHER.HTML     HEADER  INFO DU PHOTOGRAPHE LIE A L ID DE L URL
  function displayDataPhotographer() {
    const article = document.querySelector(".photograph-header");
  
    // Récupérer le bouton existant pour éviter de le perdre
    const contactButton = article.querySelector(".contact_button");
  
    article.innerHTML = `    
      <div class="textFlexbox" >
        <h2>${name}</h2>
        <h3>${city}, ${country}</h3>
        <h4>${tagline}</h4>
      </div>
      <div class="imgFlexbox" >
        <img class="imgPhoto" src="${picture}" alt="Photo de ${name}">
      </div>
    `;
  
    // Réinjecter le bouton dans le DOM
    article.appendChild(contactButton);
  
    return article;
  }

  function nameFormTemplate() {
    const article = document.createElement("article");
    article.innerHTML = `    
        
        <p>${name}</p>
      `;

    return article;
  }

  function pricePhotographer() {
    const article = document.createElement("article");
    article.innerHTML = `    
        <div>
        <p>${price}€/ jours</p>
        </div>
      `;

    return article;
  }

  return { getUserCardDOM, displayDataPhotographer, nameFormTemplate, pricePhotographer };
}

function mediaTemplate(data) {
  const {  mediaLink, title, likes } = data;
  let currentLikes = likes;
  const isVideo = mediaLink.endsWith(".mp4");

  function mediaDOM() {
    const article = document.createElement("article");
    article.innerHTML = `
      <div class="blocMedia">
        ${
          isVideo
            ? `<div class="videoMedia onFocus" tabindex="0">
              <video controls>
                <source src="${mediaLink}" type="video/mp4"  aria-label="Video ${title}">
              </video>
            </div>`
            : `<img class="media onFocus" tabindex="0" src="${mediaLink}" alt="Photo ${title}">`
        }
        <div class="blocTitleLikes">
          <h2>${title}</h2>
          <p>
            <span class="likesNumbers">${currentLikes}</span> 
            <i class="fa-regular fa-heart likeIcon onFocus" tabindex="0" aria-label="button like"></i>
          </p>
        </div>
      </div>
    `;

    const likeIcon = article.querySelector(".likeIcon");
    const likesCount = article.querySelector(".likesNumbers");
    const contentLikes = document.querySelector(".contentLikes");

    // Event listener for click
    likeIcon.addEventListener("click", () => {
      if (likeIcon.classList.contains("fa-regular")) {
        likeIcon.classList.remove("fa-regular");
        likeIcon.classList.add("fa-solid");
        currentLikes++;
        contentLikes.textContent++;
      } else {
        likeIcon.classList.remove("fa-solid");
        likeIcon.classList.add("fa-regular");
        currentLikes--;
        contentLikes.textContent--;
      }
      likesCount.textContent = currentLikes;
    });

    // Event listener for Enter key
    likeIcon.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        if (likeIcon.classList.contains("fa-regular")) {
          likeIcon.classList.remove("fa-regular");
          likeIcon.classList.add("fa-solid");
          currentLikes++;
          contentLikes.textContent++;
        } else {
          likeIcon.classList.remove("fa-solid");
          likeIcon.classList.add("fa-regular");
          currentLikes--;
          contentLikes.textContent--;
        }
        likesCount.textContent = currentLikes;
        
      }
    });

    return article;
  }

  return { mediaDOM };
}

