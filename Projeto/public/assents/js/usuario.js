
document.getElementById('cadastroUsu-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const login = document.getElementById('login').value.trim();
  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value.trim();

  if (!login || !nome || !email || !senha) {
    alert('Por favor, preencha todos os campos.');
    return;
  }

  const newUser = {
    login: login,
    nome: nome,
    email: email,
    senha: senha,
    admin: false
  };

  fetch('http://localhost:3000/usuarios', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newUser)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Erro ao cadastrar usuário: ' + response.status);
    }
    return response.json();
  })
  .then(data => {
    alert(`Usuário ${data.nome} cadastrado com sucesso!`);
    window.location.href = 'login.html';
  })
  .catch(error => {
    console.error('Erro:', error);
    alert('Erro ao cadastrar usuário.');
  });
});
