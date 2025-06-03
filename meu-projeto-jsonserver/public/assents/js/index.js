var cabe = document.getElementById("cabe");
var rodape = document.getElementById("rodape");

cabe.innerHTML = `
  <a id="logo" href="index.html"><img src="assents/img/Logo.png" alt="Logo"></a>
  <nav id="nav-links">
    <a href="cadastro.html">Cadastro</a>
    <a href="favoritos.html">Favoritos</a>
    <a href="login.html">Login</a> | <a href="logout.html">Logout</a>
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
    for (let i = 0; i < data.length; i++) {
      let card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${data[i].imagem}" alt="Imagem da Receita">
        <h2>${data[i].nome}</h2>
        <p>${data[i].descricao}</p>
        <a href="detalhes.html?id=${data[i].id}">Ver Receita</a>
      `;
      document.getElementById("card").appendChild(card);
      
    }

    // Aqui você pode manipular os dados recebidos, por exemplo, renderizar na página
  })
  .catch(error => {
    console.error('Erro ao buscar receitas:', error);
  });
