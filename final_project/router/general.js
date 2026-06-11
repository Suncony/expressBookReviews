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
    return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;
    return res.send(books[isbn]);
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    //Write your code here
    const keys = Object.keys(books);
    const author = req.params.author;

    for (let key of keys) {
        if (books[key].author === author) {
            return res.send(books[key]);
        }
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    //Write your code here
    const keys = Object.keys(books);
    const title = req.params.title;

    for (let key of keys) {
        if (books[key].title === title) {
            return res.send(books[key]);
        }
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;
    return res.send(books[isbn].reviews);
});

module.exports.general = public_users;
