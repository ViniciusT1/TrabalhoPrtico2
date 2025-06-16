const body = document.body;


const main = document.createElement('main');
main.className = 'main-content';


const infoSection = document.createElement('section');
infoSection.id = 'informacoes-geral';
infoSection.className = 'info-geral';

const infoTitle = document.createElement('h2');
infoTitle.textContent = 'Informações Geral';
infoSection.appendChild(infoTitle);

const infoContent = document.createElement('div');
infoContent.className = 'info-geral-content';

const mainImageDiv = document.createElement('div');
mainImageDiv.className = 'imagem-principal';
mainImageDiv.id = 'imagem-principal';


const detailsTextDiv = document.createElement('div');
detailsTextDiv.className = 'detalhes-texto';
detailsTextDiv.id = 'detalhes-texto';

infoContent.appendChild(mainImageDiv);
infoContent.appendChild(detailsTextDiv);
infoSection.appendChild(infoContent);

// YouTube player section
const videoSection = document.createElement('section');
videoSection.id = 'video-player';
videoSection.className = 'video-player';

const videoTitle = document.createElement('h2');
videoTitle.textContent = 'Vídeo';

videoSection.appendChild(videoTitle);

const videoContainer = document.createElement('div');
videoContainer.id = 'youtube-player';
videoSection.appendChild(videoContainer);

// Fotos do Item section
const fotosSection = document.createElement('section');
fotosSection.id = 'fotos-do-item';
fotosSection.className = 'fotos-item';

const fotosTitle = document.createElement('h2');
fotosTitle.textContent = 'Fotos do Item';
fotosTitle.style.textAlign = 'center';
fotosSection.appendChild(fotosTitle);

const carouselDiv = document.createElement('div');
carouselDiv.className = 'carousel';
carouselDiv.id = 'carousel';

fotosSection.appendChild(carouselDiv);

main.appendChild(infoSection);
main.appendChild(fotosSection); 
main.appendChild(videoSection); 

body.insertBefore(main, rodape);

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

fetch(`http://localhost:3000/Receitas/${id}`)
  .then(response => {
    if (!response.ok) {
      throw new Error('Erro ao buscar os detalhes do produto');
    }
    return response.json();
  })
  .then(deta => {
    renderDetalhes(deta);
  })
  .catch(error => {
    console.error('Erro:', error);
  });

function renderDetalhes(deta) {
  function getFavorites() {
    const favs = localStorage.getItem('favorites');
    return favs ? JSON.parse(favs) : [];
  }

  function saveFavorites(favs) {
    localStorage.setItem('favorites', JSON.stringify(favs));
  }

  function toggleFavorite(id, heartIcon) {
    let favorites = getFavorites();
    if (favorites.includes(id)) {
      favorites = favorites.filter(favId => favId !== id);
      heartIcon.setAttribute('fill', 'none');
      heartIcon.classList.remove('filled');
    } else {
      favorites.push(id);
      heartIcon.setAttribute('fill', 'red');
      heartIcon.classList.add('filled');
    }
    saveFavorites(favorites);
  }

  const imagemPrincipalDiv = document.getElementById('imagem-principal');
  const detalhesTextoDiv = document.getElementById('detalhes-texto');

  let isFavorite = getFavorites().includes(deta.id);
  let heartIconSVG = `
    <svg class="heart-icon" role="button" tabindex="0" aria-label="Adicionar aos favoritos" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${isFavorite ? 'red' : 'none'}" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" style="cursor:pointer; vertical-align: middle; margin-left: 10px;">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
  `;

  imagemPrincipalDiv.innerHTML = `
    <img src="${deta.imagem || deta.imgsrc || 'assents/img/Logo.png'}" alt="${deta.titulo}" />
  `;

  detalhesTextoDiv.innerHTML = `
    <h3>${deta.titulo} ${heartIconSVG}</h3>
    <p><strong>Descrição:</strong> ${deta.descricao}</p>
    <p><strong>Ingredientes:</strong></p>
    <ul>
      ${deta.ingredientes.map(ingrediente => `<li>${ingrediente}</li>`).join('')}
    </ul>
    <p><strong>Modo de Preparo:</strong> ${deta.modoPreparo}</p>
  `;


  const heartIconElement = detalhesTextoDiv.querySelector('.heart-icon');
  if (heartIconElement) {
    heartIconElement.addEventListener('click', function(event) {
      event.preventDefault();
      toggleFavorite(deta.id, this);
    });
    heartIconElement.addEventListener('keydown', function(event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleFavorite(deta.id, this);
      }
    });
  }

  // Renderizar YouTube player if video URL exists
  const videoContainer = document.getElementById('youtube-player');
  videoContainer.innerHTML = '';
  if (deta.videoUrl) {
    const videoId = extractYouTubeID(deta.videoUrl);
    if (videoId) {
      const iframe = document.createElement('iframe');
      iframe.width = '560';
      iframe.height = '315';
      iframe.src = `https://www.youtube.com/embed/${videoId}`;
      iframe.title = 'YouTube video player';
      iframe.frameBorder = '0';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      videoContainer.appendChild(iframe);
    } else {
      videoContainer.textContent = 'Vídeo não disponível.';
    }
  } else {
    videoContainer.textContent = 'Vídeo não disponível.';
  }

  // Renderizar Fotos do Item carousel
  const carouselDiv = document.getElementById('carousel');
  const fotos = [];
  if (deta.imgsrc) fotos.push(deta.imgsrc);
  else if (deta.imagem) fotos.push(deta.imagem);
  else fotos.push('assents/img/Logo.png');

  carouselDiv.innerHTML = fotos.map((foto, index) => `
    <img src="${foto}" alt="Foto ${index + 1}" class="carousel-image" style="display: block; margin-bottom: 10px; width: 300px; height: 200px; object-fit: contain; border-radius: 8px; min-width: 300px; min-height: 200px; max-width: 300px; max-height: 200px;" />
  `).join('');
}

function extractYouTubeID(url) {
  if (!url) return null;
  const regExp = /(?:youtube[.-]com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([\w-]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}
