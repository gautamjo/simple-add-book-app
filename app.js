// book class
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI class
class UI {
    // add book to list
    addBookToList(book) {
        // get element tbody
        const list = document.querySelector("#book-list");
        // create tr elements
        const row = document.createElement("tr");
        // insert cols
        row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="delete">X</i></a></td>
    `;
        list.appendChild(row);
    }

    // delete book
    deleteBook(target) {
        if (target.className === "delete") {
            // traverse up to the parent element which in this case is the tr
            target.parentElement.parentElement.remove();
        }
    }

    // show alert
    showAlert(msg, className) {
        // create div
        const div = document.createElement("div");
        // add class
        div.className = `alert ${className}`;
        // add text
        div.appendChild(document.createTextNode(msg));
        // get parent
        const container = document.querySelector(".container");
        const form = document.querySelector("#book-form");
        // insert alert
        container.insertBefore(div, form);
        // timeout after 3 seconds
        setTimeout(function() {
            document.querySelector(".alert").remove();
        }, 3000);
    }

    // clear fields
    clearFields() {
        document.querySelector("#title").value = "";
        document.querySelector("#author").value = "";
        document.querySelector("#isbn").value = "";
    }
}

// local storage class
class LocalStorage {
    static getBooks() {
        let books;
        if (localStorage.getItem("books") === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'))
        }

        return books;
    }

    static displayBooks() {
        const books = LocalStorage.getBooks();
        books.forEach(book => {
            const ui = new UI();

            // add book to ui
            ui.addBookToList(book);
        });
    }

    static addBook(book) {
        const books = LocalStorage.getBooks();
        books.push(book);

        localStorage.setItem("books", JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = LocalStorage.getBooks();

        books.forEach(function(book, index) {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }

            localStorage.setItem("books", JSON.stringify(books));
        });
    }
}

// DOM load event
document.addEventListener("DOMContentLoaded", LocalStorage.displayBooks);

// event listener for adding books
document.querySelector("#book-form").addEventListener("submit", function(e) {
    // get form values
    const title = document.querySelector("#title").value,
        author = document.querySelector("#author").value,
        isbn = document.querySelector("#isbn").value;

    // instantiate book
    const book = new Book(title, author, isbn);

    // instatiate UI
    const ui = new UI();

    // validate 
    if (!(title && author && isbn)) {
        ui.showAlert("Please fill in all fields", "error");
    } else {
        // add book to list
        ui.addBookToList(book)

        // add to local storage
        LocalStorage.addBook(book);

        // clear fields
        ui.clearFields();

        // show alert
        ui.showAlert("New book added", "success");
    }
    // prevent default submit behaviour
    e.preventDefault();
})

// add event listener for deleting books
document.querySelector("#book-list").addEventListener("click", function(e) {
    // instatiate UI
    const ui = new UI();
    // call function deleteBook
    ui.deleteBook(e.target);
    // remove from local storage
    LocalStorage.removeBook(e.target.parentElement.previousElementSibling.textContent);
    // show alert
    ui.showAlert("Book deleted", "success");
    // prevent default behaviour
    e.preventDefault();
})