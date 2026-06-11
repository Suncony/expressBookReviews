const axios = require('axios');
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
            return res.send(bookList);
        })
        .catch((err) => {
            return res.status(500).send(err);
        });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;

    axios.get('http://localhost:5000/')
        .then(function (response) {
            const books = response.data;

            if (books[isbn]) {
                return res.send(books[isbn]);
            } else {
                return res.status(404).send("Book not found");
            }
        })
        .catch(function (error) {
            return res.status(500).send("Error retrieving book by ISBN");
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

    axios.get('http://localhost:5000/')
        .then(function (response) {
            const books = response.data;
            const matchingBooks = [];

            Object.keys(books).forEach(function (key) {
                if (books[key].author === author) {
                    matchingBooks.push(books[key]);
                }
            });

            if (matchingBooks.length > 0) {
                return res.send(matchingBooks);
            } else {
                return res.status(404).send("Author not found");
            }
        })
        .catch(function (error) {
            return res.status(500).send("Error retrieving books by author");
        });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    //Write your code here
    const title = req.params.title;

    axios.get('http://localhost:5000/')
        .then(function (response) {
            const books = response.data;
            const matchingBooks = [];

            Object.keys(books).forEach(function (key) {
                if (books[key].title === title) {
                    matchingBooks.push(books[key]);
                }
            });

            if (matchingBooks.length > 0) {
                return res.send(matchingBooks);
            } else {
                return res.status(404).send("Title not found");
            }
        })
        .catch(function (error) {
            return res.status(500).send("Error retrieving books by title");
        });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;
    return res.send(books[isbn].reviews);
});

module.exports.general = public_users;
