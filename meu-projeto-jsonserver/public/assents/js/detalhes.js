// Build the details page content dynamically with improved layout and YouTube player

const body = document.body;

// Clear existing content except footer and header


// Create main content container
const main = document.createElement('main');
main.className = 'main-content';

// Informações Geral section
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

// Append sections to main
main.appendChild(infoSection);
main.appendChild(videoSection);
main.appendChild(fotosSection);

// Insert main before footer
body.insertBefore(main, rodape);

// Fetch and render details
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
  // Render Informações Geral
  const imagemPrincipalDiv = document.getElementById('imagem-principal');
  const detalhesTextoDiv = document.getElementById('detalhes-texto');

  imagemPrincipalDiv.innerHTML = `
    <img src="${deta.imagem || deta.imgsrc || 'assents/img/Logo.png'}" alt="${deta.titulo}" />
  `;

  detalhesTextoDiv.innerHTML = `
    <h3>${deta.titulo}</h3>
    <p><strong>Descrição:</strong> ${deta.descricao}</p>
    <p><strong>Ingredientes:</strong></p>
    <ul>
      ${deta.ingredientes.map(ingrediente => `<li>${ingrediente}</li>`).join('')}
    </ul>
    <p><strong>Modo de Preparo:</strong> ${deta.modoPreparo}</p>
  `;

  // Render YouTube player if video URL exists
  const videoContainer = document.getElementById('youtube-player');
  videoContainer.innerHTML = '';
  if (deta.videoUrl) {
    const videoId = extractYouTubeID(deta.videoUrl);
    if (videoId) {
      const link = document.createElement('a');
      link.href = deta.videoUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = 'Assistir vídeo no YouTube';
      videoContainer.appendChild(link);
    } else {
      videoContainer.textContent = 'Vídeo não disponível.';
    }
  } else {
    videoContainer.textContent = 'Vídeo não disponível.';
  }

  // Render Fotos do Item carousel
  const carouselDiv = document.getElementById('carousel');
  // For photos, use imgsrc or imagem fields, or fallback to logo
  const fotos = [];
  if (deta.imgsrc) fotos.push(deta.imgsrc);
  else if (deta.imagem) fotos.push(deta.imagem);
  else fotos.push('assents/img/Logo.png');

  carouselDiv.innerHTML = fotos.map((foto, index) => `
    <img src="${foto}" alt="Foto ${index + 1}" class="carousel-image" style="display: block; margin-bottom: 10px;" />
  `).join('');
}

