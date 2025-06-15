document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('favorites-container');

  function getFavorites() {
    const favs = localStorage.getItem('favorites');
    return favs ? JSON.parse(favs) : [];
  }

  fetch('http://localhost:3000/Receitas')
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro na requisição: ' + response.status);
      }
      return response.json();
    })
    .then(data => {
      const favorites = getFavorites();
      const favoriteRecipes = data.filter(recipe => favorites.includes(recipe.id));

      if (favoriteRecipes.length === 0) {
        container.innerHTML = '<p>Você não tem favoritos ainda.</p>';
        return;
      }

      favoriteRecipes.forEach(recipe => {
        let card = document.createElement('a');
        card.className = 'card';
        card.href = `detalhes.html?id=${recipe.id}`;
        let imgSrc = recipe.imgsrc ? recipe.imgsrc : recipe.imagem;

        card.innerHTML = `
          <img src="${imgSrc}" alt="ERRO">
          <h2>${recipe.titulo}</h2>
          <p>${recipe.descricao}</p>
        `;
        container.appendChild(card);
      });
    })
    .catch(error => {
      console.error('Erro ao buscar receitas:', error);
      container.innerHTML = '<p>Erro ao carregar favoritos.</p>';
    });
});
