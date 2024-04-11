const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

//  Task *6
public_users.post("/register", (req,res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Please provide username and password" });
    }
    if (users.find((user) => user.username === username)) {
      return res.status(409).json({ message: "This user already exists" });
    }
    users.push({ username, password });
    return res.status(201).json({ message: "Registered successfully" });
});

//  Task *10
const getBooks = () => {
    return new Promise((resolve, reject) => {
        resolve(books);
    });
};

//  Task *1
public_users.get('/',async function (req, res) {
  try {
    const bookList = await getBooks(); 
    res.json(bookList); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not get the book list" });
  }
});

//  Task *11
const getByISBN = (isbn) => {
    return new Promise((resolve, reject) => {
        let isbnNum = parseInt(isbn);
        if (books[isbnNum]) {
            resolve(books[isbnNum]);
        } else {
            reject({ status: 404, message: `ISBN #${isbn} does not exist` });
        }
    });
};

//  Task *2
public_users.get('/isbn/:isbn',function (req, res) {
    getByISBN(req.params.isbn)
    .then(
        result => res.send(result),
        error => res.status(error.status).json({message: error.message})
    );
 });

//  Task *3 + *12
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    getBooks()
    .then((bookEntries) => Object.values(bookEntries))
    .then((books) => books.filter((book) => book.author === author))
    .then((filteredBooks) => res.send(filteredBooks));
});

//  Task *4 + *12
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    getBooks()
    .then((bookEntries) => Object.values(bookEntries))
    .then((books) => books.filter((book) => book.title === title))
    .then((filteredBooks) => res.send(filteredBooks));
});

//  Task *5 + *13
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    getByISBN(req.params.isbn)
    .then(
        result => res.send(result.reviews),
        error => res.status(error.status).json({message: error.message})
    );
});

module.exports.general = public_users;