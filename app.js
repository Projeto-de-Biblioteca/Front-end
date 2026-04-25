const bookForm    = document.getElementById('book-form');
const bookId      = document.getElementById('book-id');
const title       = document.getElementById('title');
const authorName  = document.getElementById('authorName');
const genre       = document.getElementById('genre');
const pages       = document.getElementById('pages');
const booksList   = document.getElementById('books-list');
const message     = document.getElementById('message');
const cancelEdit  = document.getElementById('cancel-edit');
const formTitle   = document.getElementById('form-title');
const refreshBtn  = document.getElementById('refresh-books');

// URL da API
const API_URL = 'https://back-end-black.vercel.app/livros';

// Função para exibir mensagens na tela
function showMessage(text) {
  message.textContent = text;
  setTimeout(() => { message.textContent = ''; }, 3000);
}

// Limpar o formulário e resetar estados
function clearForm() {
  bookForm.reset();
  bookId.value = '';
  formTitle.textContent = 'Novo Livro';
  cancelEdit.classList.add('d-none');
}

// READ: Carregar livros do MongoDB
async function loadBooks() {
  try {
    const response = await fetch(API_URL);
    const books = await response.json();

    if (!books || books.length === 0) {
      booksList.innerHTML = '<p class="text-center text-muted">Nenhum livro na estante.</p>';
      return;
    }

    booksList.innerHTML = books.map(book => `
      <div class="col-md-6 mb-3">
        <div class="list-group-item">
          <h3 class="h5">${book.title}</h3>
          <p class="mb-1"><strong>Autor:</strong> ${book.authorName}</p>
          <p class="mb-1 small" style="color:#94a3b8">Gênero: ${book.genre} | Páginas: ${book.pages}</p>
          <div class="mt-3 d-flex gap-2">
            <button class="btn btn-sm btn-warning" onclick="editBook('${book._id}')">Editar</button>
            <button class="btn btn-sm btn-danger" onclick="deleteBook('${book._id}')">Excluir</button>
          </div>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Erro ao carregar:', error);
    showMessage('Erro ao conectar com o servidor.');
  }
}

// CREATE / UPDATE: Salvar livro
bookForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const id = bookId.value;
  const data = {
    title: title.value,
    authorName: authorName.value,
    genre: genre.value,
    pages: Number(pages.value)
  };

  try {
    let response;
    
    if (id) {
      // Rota de Edição
      response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if(response.ok) showMessage('Livro atualizado com sucesso!');
    } else {
      // Rota de Criação
      response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if(response.ok) showMessage('Livro adicionado à estante!');
    }

    if (response.ok) {
      clearForm();
      loadBooks();
    }
  } catch (error) {
    showMessage('Erro ao salvar o livro.');
  }
});

// Preparar formulário para edição
window.editBook = async function(id) {
  try {
    // Busca todos e filtra o correto
    const response = await fetch(API_URL);
    const books = await response.json();
    const book = books.find(b => b._id === id);

    if (!book) return;

    bookId.value = book._id;
    title.value = book.title;
    authorName.value = book.authorName;
    genre.value = book.genre;
    pages.value = book.pages;

    formTitle.textContent = 'Editar Livro';
    cancelEdit.classList.remove('d-none');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error) {
    showMessage('Erro ao buscar dados do livro.');
  }
};

// DELETE: Remover livro
window.deleteBook = async function(id) {
  if (!confirm('Deseja realmente excluir este livro?')) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      showMessage('Livro removido!');
      loadBooks();
    }
  } catch (error) {
    showMessage('Erro ao excluir o livro.');
  }
};

// Botão Cancelar Edição
cancelEdit.addEventListener('click', clearForm);

// Botão Atualizar Manual
refreshBtn.addEventListener('click', loadBooks);

// Inicializar a lista ao abrir a página
document.addEventListener('DOMContentLoaded', () => {
  loadBooks();
  if (typeof lucide !== 'undefined') lucide.createIcons();
});