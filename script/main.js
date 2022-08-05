/* eslint-disable max-classes-per-file */
const form = document.querySelector('form');
const navlist = document.querySelector('.nav-list');
const navadd = document.querySelector('.nav-add');
const navcontact = document.querySelector('.nav-contact');
const mainAddBook = document.querySelector('.main-addBook');
const mainList = document.querySelector('.main-list');
const mainContactUs = document.querySelector('.main-contactus');
const mainEmpty = document.querySelector('.main-empty');

document.querySelector('time').innerHTML = new Date().toLocaleString();
navlist.addEventListener('click', () => {
  mainList.classList.remove('hide');
  mainAddBook.classList.add('hide');
  mainContactUs.classList.add('hide');
});
navadd.addEventListener('click', () => {
  mainList.classList.add('hide');
  mainAddBook.classList.remove('hide');
  mainContactUs.classList.add('hide');
});
navcontact.addEventListener('click', () => {
  mainList.classList.add('hide');
  mainAddBook.classList.add('hide');
  mainContactUs.classList.remove('hide');
});

class Book {
  constructor(title, author) {
    this.title = title;
    this.author = author;
  }
}
class Storage {
  static domBooksListFromStorage() {
    let books;
    if (localStorage.getItem('books') === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem('books'));
    }
    return books;
  }

  static addBooksToStorage(book) {
    const books = Storage.domBooksListFromStorage();

    books.push(book);

    localStorage.setItem('books', JSON.stringify(books));
  }

  static removeBooksFromStorage(title) {
    const books = Storage.domBooksListFromStorage();

    books.forEach((book, i) => {
      if (book.title === title) {
        books.splice(i, 1);
      }
    });

    localStorage.setItem('books', JSON.stringify(books));
  }

  static checkEmptyList() {
    const books = Storage.domBooksListFromStorage();
    if (books.length === 0) {
      mainEmpty.classList.remove('hide');
    } else {
      mainEmpty.classList.add('hide');
    }
  }
}
class BooksToDom {
  static displayBooksInDom() {
    Storage.checkEmptyList();
    const books = Storage.domBooksListFromStorage();

    books.forEach((book) => BooksToDom.domBooksList(book));
  }

  static domBooksList(book) {
    const tbody = document.querySelector('#tbody');
    const tableRow = document.createElement('tr');

    tableRow.innerHTML = `
    <td>${book.author}</td>
    <td>by</td>
    <td>${book.title}</td>
    <td><a href="#" class='RemoveBtn'>Remove</a></td>
    `;
    tbody.appendChild(tableRow);
  }

  static deleteBook(el) {
    if (el.classList.contains('RemoveBtn')) {
      el.parentElement.parentElement.remove();
    }
  }

  static clearField() {
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = '';
  }
}

document.addEventListener('DOMContentLoaded', BooksToDom.displayBooksInDom);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;

  const book = new Book(title, author);

  BooksToDom.domBooksList(book);

  Storage.addBooksToStorage(book);

  Storage.checkEmptyList();

  BooksToDom.clearField();
});

document.querySelector('#tbody').addEventListener('click', (e) => {
  BooksToDom.deleteBook(e.target);

  Storage.removeBooksFromStorage(
    e.target.parentElement.previousElementSibling.textContent,
  );
  Storage.checkEmptyList();
});
