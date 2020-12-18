const library = document.querySelector('.library');
const addBook = document.querySelector('.add-book');
const modalOverlay = document.querySelector('.modal-overlay');
const modalCloseBtn = document.querySelector('.modal__close');
const form = document.querySelector('.modal__form');

let myLibrary;

if (localStorage.getItem('library') == null) {
    myLibrary = [];
    const book1 = new Book("Dark Matter", "Aase Berg", "188", true);
    const book2 = new Book("Kids of the Black Hole", "Marty Cain", "67", false);

    myLibrary.push(book1);
    myLibrary.push(book2);
} else {
    myLibrary =  JSON.parse(localStorage.getItem('library'));
}

displayAllBooks();

addBook.addEventListener("click", openModal);
modalCloseBtn.addEventListener("click", closeModal);
form.addEventListener("submit", addBookToLibrary);

function openModal() {
    modalOverlay.style.display = "flex";
}

function closeModal() {
    modalOverlay.style.display = "none";
}

function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

function addBookToLibrary() {
    let title = document.querySelector('#title').value;
    let author = document.querySelector('#author').value;
    let pages = document.querySelector('#pages').value;
    let read = document.querySelector('#read-check').checked;

    let book = new Book(title, author, pages, read);
    myLibrary.push(book);
    localStorage.setItem('library', JSON.stringify(myLibrary));
    createBook(myLibrary.length - 1);
    closeModal();
}

function displayAllBooks() {
    for (let i = 0; i < myLibrary.length; i++) {
        createBook(i);
    }
}

function displayBook(book) {
    library.insertBefore(book, addBook);
}

function createBook(index) {
    let book = document.createElement('div');
    book.classList.add('book');
    book.setAttribute('data-index', `${index}`);

    fillBook(book, index);
    addRemoveBtn(book)

    displayBook(book);
}

function fillBook(book, i) {
    let title = document.createElement('h2');
    title.classList.add('book__title');
    let titleText = document.createTextNode(`${myLibrary[i].title}`);
    title.appendChild(titleText);

    let author = document.createElement('p');
    author.classList.add('book__author');
    author.innerHTML = `by \u00a0 <span class="author-name">${myLibrary[i].author}</span>`;

    let pages = document.createElement('p');
    pages.classList.add('book__pages');
    let pagesText = document.createTextNode(`${myLibrary[i].pages} pg`);
    pages.appendChild(pagesText);

    book.appendChild(title);
    book.appendChild(author);
    book.appendChild(pages);

    createReadStatus(book, i);
}

function addRemoveBtn(book) {
    let removeBtn = document.createElement('button');
    removeBtn.classList.add('book__remove-btn');
    removeBtn.setAttribute('aria-label', 'Remove From Library')
    removeBtn.innerHTML = '&times;'
    book.appendChild(removeBtn);
    removeBtn.addEventListener("click", removeBookFromLibrary);
}

function removeBookFromLibrary(e) {
    let book = e.target.parentNode;
    let index = book.dataset.index;
    myLibrary.splice(index, 1);
    localStorage.setItem('library', JSON.stringify(myLibrary));
    book.parentNode.removeChild(book);
}

function createReadStatus(book, i) {
    let readStatus = document.createElement('button');
    readStatus.classList.add('book__read-status');
    readStatus.setAttribute('aria-label', 'Toggle Read Status')
    readStatus.addEventListener("click", toggleRead);

    if (myLibrary[i].read) {
        let readStatusText = document.createTextNode('READ');
        readStatus.appendChild(readStatusText);
        readStatus.classList.add('book__read-status--read');
    } else {
        let readStatusText = document.createTextNode('NOT READ');
        readStatus.appendChild(readStatusText);
        readStatus.classList.add('book__read-status--not-read');
    }

    book.appendChild(readStatus);
}

function toggleRead(e) {
    let readStatus = e.target;
    let book = readStatus.parentNode;
    let index = book.dataset.index;
    myLibrary[index].read = !myLibrary[index].read;
    localStorage.setItem('library', JSON.stringify(myLibrary));

    if (readStatus.textContent === 'READ') {
        readStatus.textContent = 'NOT READ';
        readStatus.classList.remove('book__read-status--read');
        readStatus.classList.add('book__read-status--not-read');
    } else {
        readStatus.textContent = 'READ';
        readStatus.classList.remove('book__read-status--not-read');
        readStatus.classList.add('book__read-status--read');
    }
}