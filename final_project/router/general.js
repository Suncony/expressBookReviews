const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');
const BASE_URL = "http://localhost:5000";


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

// Internal route used by Axios to safely retrieve all book data.
// This prevents routes like "/" from calling themselves recursively.
public_users.get('/books-data', function (req, res) {
    return res.status(200).json(books);
});


// Get the list of books available in the shop using async/await with Axios
public_users.get('/', async function (req, res) {
    try {
        const response = await axios.get(`${BASE_URL}/books-data`);

        return res.status(200).json(response.data);

    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving book list"
        });
    }
});


// Get book details based on ISBN using async/await with Axios
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;

    try {
        const response = await axios.get(`${BASE_URL}/books-data`);
        const bookList = response.data;

        if (bookList[isbn]) {
            return res.status(200).json(bookList[isbn]);
        } else {
            return res.status(404).json({
                message: "Book not found for the given ISBN"
            });
        }

    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving book by ISBN"
        });
    }
});


// Get book details based on Author using async/await with Axios
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author.toLowerCase();

    try {
        const response = await axios.get(`${BASE_URL}/books-data`);
        const bookList = response.data;

        const matchingBooks = Object.values(bookList).filter(function (book) {
            return book.author.toLowerCase() === author;
        });

        if (matchingBooks.length > 0) {
            return res.status(200).json(matchingBooks);
        } else {
            return res.status(404).json({
                message: "No books found for the given author"
            });
        }

    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving books by author"
        });
    }
});


// Get book details based on Title using async/await with Axios
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title.toLowerCase();

    try {
        const response = await axios.get(`${BASE_URL}/books-data`);
        const bookList = response.data;

        const matchingBooks = Object.values(bookList).filter(function (book) {
            return book.title.toLowerCase() === title;
        });

        if (matchingBooks.length > 0) {
            return res.status(200).json(matchingBooks);
        } else {
            return res.status(404).json({
                message: "No books found for the given title"
            });
        }

    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving books by title"
        });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;
    return res.send(books[isbn].reviews);
});

module.exports.general = public_users;
