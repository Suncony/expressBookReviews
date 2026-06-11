const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    if (isValid(username)) {
        return res.status(409).json({
            message: "User already exists"
        });
    }

    users.push({
        username: username,
        password: password
    });

    return res.status(200).json({
        message: "User successfully registered. Now you can login"
    });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    //Write your code here
    const getBooks = new Promise((resolve, reject) => {
        resolve(books);
    });

    getBooks
        .then((bookList) => {
            return res.send(JSON.stringify(bookList, null, 4));
        })
        .catch((err) => {
            return res.status(500).send(err);
        });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;

    const getBook = new Promise((resolve, reject) => {

        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject("Book not found");
        }

    });

    getBook
        .then((book) => {
            return res.send(book);
        })
        .catch((err) => {
            return res.status(404).send(err);
        });
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    //Write your code here
    const author = req.params.author;

    const getBook = new Promise((resolve, reject) => {

        const keys = Object.keys(books);
        const matchingBooks = [];

        for (let key of keys) {
            if (books[key].author === author) {
                matchingBooks.push(books[key]);
            }
        }

        if (matchingBooks.length > 0) {
            resolve(matchingBooks);
        } else {
            reject("Author not found");
        }


    });

    getBook
        .then((book) => {
            return res.send(book);
        })
        .catch((err) => {
            return res.status(404).send(err);
        });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    //Write your code here
    const title = req.params.title;

    const getBook = new Promise((resolve, reject) => {

        const keys = Object.keys(books);
        const matchingBooks = [];

        for (let key of keys) {
            if (books[key].title === title) {
                matchingBooks.push(books[key]);
            }
        }

        if (matchingBooks.length > 0) {
            resolve(matchingBooks);
        } else {
            reject("Title not found");
        }


    });

    getBook
        .then((book) => {
            return res.send(book);
        })
        .catch((err) => {
            return res.status(404).send(err);
        });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;
    return res.send(books[isbn].reviews);
});

module.exports.general = public_users;
