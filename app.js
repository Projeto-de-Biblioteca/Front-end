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

function getBooks() {
  return JSON.parse(localStorage.getItem('biblioteca')) || [];
}

function saveBooks(books) {
  localStorage.setItem('biblioteca', JSON.stringify(books));
}

function showMessage(text) {
  message.textContent = text;
  setTimeout(() => { message.textContent = ''; }, 3000);
}

function clearForm() {
  bookForm.reset();
  bookId.value = '';
  formTitle.textContent = 'Novo Livro';
  cancelEdit.classList.add('d-none');
}

function loadBooks() {
  const books = getBooks();

  if (!books.length) {
    booksList.innerHTML = '<p class="text-center text-muted">Nenhum livro na estante.</p>';
    return;
  }

  booksList.innerHTML = books.map(book => `
    <div class="col-md-6 mb-3">
      <div class="list-group-item">
        <h3 class="h5">${book.title}</h3>
        <p class="mb-1"><strong>Autor:</strong> ${book.authorName}</p>
        <p class="mb-1 small" style="color:#94a3b8">Gênero: ${book.genre} | Páginas: ${book.pages || 'N/A'}</p>
        <div class="mt-3 d-flex gap-2">
          <button class="btn btn-sm btn-warning" onclick="editBook('${book.id}')">Editar</button>
          <button class="btn btn-sm btn-danger" onclick="deleteBook('${book.id}')">Excluir</button>
        </div>
      </div>
    </div>
  `).join('');
}

bookForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const books = getBooks();
  const id = bookId.value;

  const data = {
    id: id || Date.now().toString(),
    title: title.value,
    authorName: authorName.value,
    genre: genre.value,
    pages: pages.value
  };

  if (id) {
    const idx = books.findIndex(b => b.id === id);
    books[idx] = data;
    showMessage('Livro atualizado!');
  } else {
    books.push(data);
    showMessage('Livro adicionado!');
  }

  saveBooks(books);
  clearForm();
  loadBooks();
});

window.editBook = function(id) {
  const book = getBooks().find(b => b.id === id);
  if (!book) return;

  bookId.value = book.id;
  title.value = book.title;
  authorName.value = book.authorName;
  genre.value = book.genre;
  pages.value = book.pages;

  formTitle.textContent = 'Editar Livro';
  cancelEdit.classList.remove('d-none');
  window.scrollTo(0, 0);
};

window.deleteBook = function(id) {
  if (!confirm('Deseja mesmo remover este livro?')) return;
  const books = getBooks().filter(b => b.id !== id);
  saveBooks(books);
  showMessage('Livro removido.');
  loadBooks();
};

cancelEdit.addEventListener('click', clearForm);
refreshBtn.addEventListener('click', loadBooks);

loadBooks();