// cadastro.js

const API_URL = 'http://localhost:3000/Receitas';

document.addEventListener('DOMContentLoaded', () => {
    // Check if logged in user is admin
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!loggedInUser || !loggedInUser.admin) {
        alert('Acesso negado. Apenas administradores podem acessar esta página.');
        window.location.href = 'index.html';
        return;
    }

    const form = document.getElementById('cadastro-form');
    const tableBody = document.querySelector('#receitas-table tbody');

    let editId = null;

    // Load and display all recipes
    function loadReceitas() {
        fetch(API_URL)
            .then(response => response.json())
            .then(data => {
                renderTable(data);
            })
            .catch(error => {
                alert('Erro ao carregar receitas: ' + error);
            });
    }

    // Render table rows
    function renderTable(receitas) {
        tableBody.innerHTML = '';
        receitas.forEach(receita => {
            const tr = document.createElement('tr');

            tr.innerHTML = `
                <td>${receita.id}</td>
                <td>${receita.titulo}</td>
                <td>${receita.descricao}</td>
                <td>${receita.ingredientes.join(', ')}</td>
                <td><img src="${receita.imagem || receita.imgsrc || ''}" alt="${receita.titulo}" width="100"/></td>
                <td>${receita.modoPreparo}</td>
                <td>
                    <button class="edit-btn" data-id="${receita.id}">Editar</button>
                    <button class="delete-btn" data-id="${receita.id}">Deletar</button>
                </td>
            `;

            tableBody.appendChild(tr);
        });

        // Attach event listeners for edit and delete buttons
        document.querySelectorAll('.edit-btn').forEach(button => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('data-id');
                editReceita(id);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', () => {
                const id = button.getAttribute('data-id');
                deleteReceita(id);
            });
        });
    }

    // Edit receita: fill form with data
    function editReceita(id) {
        fetch(`${API_URL}/${id}`)
            .then(response => response.json())
            .then(receita => {
                editId = id;
                form.titulo.value = receita.titulo;
                form.descricao.value = receita.descricao;
                form.ingredientes.value = receita.ingredientes.join(', ');
                form.imagem.value = receita.imagem || receita.imgsrc || '';
                form.modoPreparo.value = receita.modoPreparo;
            })
            .catch(error => alert('Erro ao carregar receita para edição: ' + error));
    }

    // Delete receita
    function deleteReceita(id) {
        if (!confirm('Confirma a exclusão da receita?')) return;

        fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) throw new Error('Erro ao deletar receita');
            alert('Receita deletada com sucesso.');
            if (editId === id) {
                form.reset();
                editId = null;
            }
            loadReceitas();
        })
        .catch(error => alert(error));
    }

    // Handle form submit for create or update
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const receitaData = {
            titulo: form.titulo.value.trim(),
            descricao: form.descricao.value.trim(),
            ingredientes: form.ingredientes.value.split(',').map(i => i.trim()),
            imagem: form.imagem.value.trim(),
            modoPreparo: form.modoPreparo.value.trim()
        };

        if (!receitaData.titulo || !receitaData.descricao || !receitaData.modoPreparo) {
            alert('Por favor, preencha os campos obrigatórios.');
            return;
        }

        if (editId) {
            // Update existing receita
            fetch(`${API_URL}/${editId}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(receitaData)
            })
            .then(response => {
                if (!response.ok) throw new Error('Erro ao atualizar receita');
                alert('Receita atualizada com sucesso.');
                form.reset();
                editId = null;
                loadReceitas();
            })
            .catch(error => alert(error));
        } else {
            // Create new receita
            fetch(API_URL, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(receitaData)
            })
            .then(response => {
                if (!response.ok) throw new Error('Erro ao cadastrar receita');
                alert('Receita cadastrada com sucesso.');
                form.reset();
                loadReceitas();
            })
            .catch(error => alert(error));
        }
    });

    // Initial load
    loadReceitas();
});
