var cabe = document.getElementById("cabe");
var rodape = document.getElementById("rodape");

function getLoggedInUser() {
  const user = localStorage.getItem('loggedInUser');
  return user ? JSON.parse(user) : null;
}

const user = getLoggedInUser();

cabe.innerHTML = `
  <a id="logo" href="index.html"><img src="assents/img/Logo.png" alt="Logo"></a>
  <nav id="nav-links">
    <a href="cadastro.html">Cadastro</a>
    <a href="favoritos.html">Favoritos</a>
    ${user ? '' : '<a href="login.html">Login</a>'} | <a id="logout" href="#" >Logout</a>
  </nav>
`;

document.addEventListener('DOMContentLoaded', () => {
  const logoutLink = document.getElementById('logout');
  if (logoutLink) {
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('loggedInUser');
      window.location.href = 'login.html';
    });
  }
});

function getFavorites() {
  if (!user) return [];
  const favs = localStorage.getItem('favorites_' + user.login);
  return favs ? JSON.parse(favs) : [];
}

function saveFavorites(favs) {
  if (!user) return;
  localStorage.setItem('favorites_' + user.login, JSON.stringify(favs));
}

function toggleFavorite(id, heartIcon) {
  if (!user) {
    alert('Por favor, faça login para gerenciar favoritos.');
    return;
  }
  let favorites = getFavorites();
  if (favorites.includes(id)) {
    favorites = favorites.filter(favId => favId !== id);
    heartIcon.setAttribute('fill', 'none');
  } else {
    favorites.push(id);
    heartIcon.setAttribute('fill', 'red');
  }
  saveFavorites(favorites);
}

fetch('http://localhost:3000/Receitas')
  .then(response => {
    if (!response.ok) {
      throw new Error('Erro na requisição: ' + response.status);
    }
    return response.json();
  })
  .then(data => {
    console.log('Receitas recebidas:', data);

  
    for (let i = 0; i < 10; i++) {
      let card = document.createElement("a");
      card.className = "card small-card";
      card.href = `detalhes.html?id=${data[i].id}`;
      let imgSrc = data[i].imgsrc ? data[i].imgsrc : data[i].imagem;

      let favorites = getFavorites();
      let heartClass = favorites.includes(data[i].id) ? 'fas' : 'far'; // solid if favorite, regular if not
      let heartIcon = `<svg class="heart-icon" data-id="${data[i].id}" role="button" tabindex="0" aria-label="Adicionar aos favoritos" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${favorites.includes(data[i].id) ? 'red' : 'none'}" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>`;

      card.innerHTML = `
        <img src="${imgSrc}" alt="ERRO">
        <h2>${data[i].titulo}</h2>
        <p>${data[i].descricao}</p>
        ${heartIcon}
      `;
      document.getElementById("card").appendChild(card);
    }

    let largeCardsContainer = document.createElement("div");
    largeCardsContainer.id = "large-cards";
    largeCardsContainer.style.display = "flex";
    largeCardsContainer.style.justifyContent = "center";
    largeCardsContainer.style.gap = "20px";
    largeCardsContainer.style.marginTop = "20px";
    document.getElementById("conteudo").appendChild(largeCardsContainer);

    for (let i = 5; i < 7; i++) {
      let card = document.createElement("a");
      card.className = "card large-card";
      card.href = `detalhes.html?id=${data[i].id}`;
      let imgSrc = data[i].imgsrc ? data[i].imgsrc : data[i].imagem;

      let favorites = getFavorites();
      let heartClass = favorites.includes(data[i].id) ? 'fas' : 'far'; // solid if favorite, regular if not
      let heartIcon = `<svg class="heart-icon" data-id="${data[i].id}" role="button" tabindex="0" aria-label="Adicionar aos favoritos" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${favorites.includes(data[i].id) ? 'red' : 'none'}" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>`;

      card.innerHTML = `
        <img src="${imgSrc}" alt="ERRO">
        <h2>${data[i].titulo}</h2>
        <p>${data[i].descricao}</p>
        ${heartIcon}
      `;
      largeCardsContainer.appendChild(card);
    }

    document.querySelectorAll('.heart-icon').forEach(icon => {
      icon.addEventListener('click', function(event) {
        event.preventDefault();
        event.stopPropagation();
        const id = this.getAttribute('data-id');
        toggleFavorite(id, this);
      });
      icon.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          const id = this.getAttribute('data-id');
          toggleFavorite(id, this);
        }
      });
    });

    let carouselContainer = document.getElementById("carro");
    carouselContainer.innerHTML = `
      <div class="carousel">
        <button class="carousel-btn prev-btn">&#10094;</button>
        <div class="carousel-track-container">
          <ul class="carousel-track"></ul>
        </div>
        <button class="carousel-btn next-btn">&#10095;</button>
      </div>
    `;

    let track = carouselContainer.querySelector('.carousel-track');
    data.forEach(item => {
      let imgSrc = item.imgsrc ? item.imgsrc : item.imagem;
      let li = document.createElement('li');
      li.className = 'carousel-slide';
      li.innerHTML = `
        <a id = "carros"href="detalhes.html?id=${item.id}" class="card">
          <img src="${imgSrc}" alt="ERRO">
        </a>
      `;
      track.appendChild(li);
    });

    const slides = Array.from(track.children);
    const nextButton = carouselContainer.querySelector('.next-btn');
    const prevButton = carouselContainer.querySelector('.prev-btn');
    const slideWidth = slides[0].getBoundingClientRect().width;

    slides.forEach((slide, index) => {
      slide.style.left = slideWidth * index + 'px';
    });

    let currentSlideIndex = 0;

    const moveToSlide = (track, current, target) => {
      const targetLeft = parseInt(target.style.left, 10);
      track.style.transform = 'translateX(-' + targetLeft + 'px)';
      current.classList.remove('current-slide');
      target.classList.add('current-slide');
    };

    nextButton.addEventListener('click', e => {
      const currentSlide = track.querySelector('.current-slide') || slides[0];
      console.log('Next button clicked. Current slide:', currentSlide);
      let nextSlide = currentSlide.nextElementSibling;
      if (!nextSlide) {
        nextSlide = slides[0];
      }
      console.log('Moving to next slide:', nextSlide);
      moveToSlide(track, currentSlide, nextSlide);
    });

    prevButton.addEventListener('click', e => {
      const currentSlide = track.querySelector('.current-slide') || slides[0];
      console.log('Prev button clicked. Current slide:', currentSlide);
      let prevSlide = currentSlide.previousElementSibling;
      if (!prevSlide) {
        prevSlide = slides[slides.length - 1];
      }
      console.log('Moving to prev slide:', prevSlide);
      moveToSlide(track, currentSlide, prevSlide);
    });

    slides[0].classList.add('current-slide');

    window.addEventListener('resize', () => {
      const slideWidth = slides[0].getBoundingClientRect().width;
      slides.forEach((slide, index) => {
        slide.style.left = slideWidth * index + 'px';
      });
      const currentSlide = track.querySelector('.current-slide') || slides[0];
      const currentLeft = parseInt(currentSlide.style.left, 10);
      track.style.transform = 'translateX(-' + currentLeft + 'px)';
    });

  })
  .catch(error => {
    console.error('Erro ao buscar receitas:', error);
  });
  const searchInput = document.getElementById('search-input');
  searchInput.addEventListener('input', () => {
    const filter = searchInput.value.toLowerCase();

    const smallCards = document.querySelectorAll('#card .card');
    smallCards.forEach(card => {
      const title = card.querySelector('h2').textContent.toLowerCase();
      const desc = card.querySelector('p').textContent.toLowerCase();
      if (title.includes(filter) || desc.includes(filter)) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });

    const largeCards = document.querySelectorAll('#large-cards .card');
    largeCards.forEach(card => {
      const title = card.querySelector('h2').textContent.toLowerCase();
      const desc = card.querySelector('p').textContent.toLowerCase();
      if (title.includes(filter) || desc.includes(filter)) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  });
