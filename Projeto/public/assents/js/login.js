// JavaScript for login.html to validate users from JSON server

document.getElementById('login-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const loginInput = document.getElementById('login').value.trim();
  const senhaInput = document.getElementById('senha').value.trim();

  if (!loginInput || !senhaInput) {
    alert('Por favor, preencha todos os campos.');
    return;
  }

  fetch('http://localhost:3000/usuarios')
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro na requisição: ' + response.status);
      }
      return response.json();
    })
    .then(users => {
      const user = users.find(u => u.login.toLowerCase() === loginInput.toLowerCase() && u.senha === senhaInput);
      if (user) {
        alert(`Bem-vindo, ${user.nome}!`);
        // Save login state in localStorage
        localStorage.setItem('loggedInUser', JSON.stringify({ login: user.login, nome: user.nome, admin: user.admin }));
        // Redirect to index.html regardless of admin status
        window.location.href = 'index.html';
      } else {
        alert('Usuário ou senha inválidos.');
      }
    })
    .catch(error => {
      console.error('Erro ao buscar usuários:', error);
      alert('Erro ao tentar fazer login.');
    });
});
