class Book {
  constructor(title, description, author) {
      this.title = title;
      this.description = description;
      this.author = author;
  }
}

class Library {
  constructor() {
      this.books = JSON.parse(localStorage.getItem('books')) || [];
  }

  addBook(bookInfo) {
      const newBook = new Book(bookInfo.title, bookInfo.description, bookInfo.author);
      this.books.push(newBook);
      this.saveToLocalStorage();
      return newBook;
  }

  getBooks() {
      return this.books;
  }

  removeBookById(id) {
      this.books = this.books.filter(book => book.id !== id);
      this.saveToLocalStorage();
  }

  getBookById(id) {
      return this.books.find(book => book.id === id);
  }

  updateBookById(id, info) {
      const book = this.getBookById(id);
      if (book) {
          if (info.title) book.title = info.title;
          if (info.description) book.description = info.description;
          if (info.author) book.author = info.author;
          this.saveToLocalStorage();
      }
      return book;
  }

  saveToLocalStorage() {
      localStorage.setItem('books', JSON.stringify(this.books));
  }
}

const library = new Library();
const bookForm = document.getElementById('bookForm');
const bookList = document.getElementById('bookList');

function addBook() {
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const author = document.getElementById('author').value;

  library.addBook({ title, description, author });
  bookForm.reset();
  updateBookList();
}

function editBook() {
  const bookId = document.getElementById('bookId').value;
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const author = document.getElementById('author').value;

  if (bookId) {
      library.updateBookById(bookId, { title, description, author });
      bookForm.reset();
      updateBookList();
  } else {
      alert('Please select a book to edit.');
  }
}

function updateBookList() {
  bookList.innerHTML = '';

  const books = library.getBooks();

  books.forEach(book => {
      const listItem = document.createElement('li');
      listItem.textContent = `${book.title} by ${book.author} - ${book.description}`;

      const editButton = document.createElement('button');
      editButton.textContent = 'Edit';
      editButton.classList.add('btn-edit',);
      editButton.addEventListener('click', function () {
          fillFormForEdit(book.id);
      });

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.classList.add('btn-del');
      deleteButton.addEventListener('click', function () {
          library.removeBookById(book.id);
          updateBookList();
      });

      listItem.appendChild(editButton);
      listItem.appendChild(deleteButton);

      bookList.appendChild(listItem);
  });
}

function fillFormForEdit(bookId) {
  const book = library.getBookById(bookId);
  if (book) {
      document.getElementById('bookId').value = book.id;
      document.getElementById('title').value = book.title;
      document.getElementById('description').value = book.description;
      document.getElementById('author').value = book.author;
  }
}


updateBookList();
