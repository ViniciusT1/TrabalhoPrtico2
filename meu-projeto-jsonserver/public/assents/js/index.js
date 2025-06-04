var cabe = document.getElementById("cabe");
var rodape = document.getElementById("rodape");

cabe.innerHTML = `
  <a id="logo" href="index.html"><img src="assents/img/Logo.png" alt="Logo"></a>
  <nav id="nav-links">
    <a href="cadastro.html">Cadastro</a>
    <a href="favoritos.html">Favoritos</a>
    <a href="login.html">Login</a> | <a id = "logout" href="logout.html">Logout</a>
  </nav>
`;

fetch('http://localhost:3000/Receitas')
  .then(response => {
    if (!response.ok) {
      throw new Error('Erro na requisição: ' + response.status);
    }
    return response.json();
  })
  .then(data => {
    console.log('Receitas recebidas:', data);

    // Render cards
    for (let i = 0; i < 6; i++) {
      let card = document.createElement("a");
      card.className = "card";
      card.href = `detalhes.html?id=${data[i].id}`;
      let imgSrc = data[i].imgsrc ? data[i].imgsrc : data[i].imagem;
      card.innerHTML = `
        <img src="${imgSrc}" alt="ERRO">
        <h2>${data[i].titulo}</h2>
        <p>${data[i].descricao}</p>
      `;
      document.getElementById("card").appendChild(card);
    }

    // Render carousel
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

    // Arrange the slides next to one another
    slides.forEach((slide, index) => {
      slide.style.left = slideWidth * index + 'px';
    });

    let currentSlideIndex = 0;

    const moveToSlide = (track, current, target) => {
      track.style.transform = 'translateX(-' + target.style.left + ')';
      current.classList.remove('current-slide');
      target.classList.add('current-slide');
    };

    nextButton.addEventListener('click', e => {
      const currentSlide = track.querySelector('.current-slide') || slides[0];
      let nextSlide = currentSlide.nextElementSibling;
      if (!nextSlide) {
        nextSlide = slides[0];
      }
      moveToSlide(track, currentSlide, nextSlide);
    });

    prevButton.addEventListener('click', e => {
      const currentSlide = track.querySelector('.current-slide') || slides[0];
      let prevSlide = currentSlide.previousElementSibling;
      if (!prevSlide) {
        prevSlide = slides[slides.length - 1];
      }
      moveToSlide(track, currentSlide, prevSlide);
    });

    // Set first slide as current
    slides[0].classList.add('current-slide');

  })
  .catch(error => {
    console.error('Erro ao buscar receitas:', error);
  });
