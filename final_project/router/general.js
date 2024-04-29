const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if(username && password) {
    if (isValid(username)) {
      users.push({ username, password });
      return res.status(201).json({message: `user with username ${username} registered successfully. Proceed to login.`});
    } else {
      return res.status(400).json({message: "username already exists"});
    }
  } else {
    return res.status(400).json({message: "username and password are required to register"});
  }
});

// Get the book list available in the shop
const getBooks = async function () {
  return books;
}
public_users.get('/', async function (req, res) {
  return res.status(200).json({books: await getBooks()});
});


// Get book details based on ISBN
const getBookByISBN = async function (isbn) {
  const book = books[isbn];
  return book;
}
public_users.get('/isbn/:isbn',async function (req, res) {
  const book = await getBookByISBN(req.params.isbn);
  return res.status(200).json({...book});
 });
  
// Get book details based on author
const getBookDetailsByAuthor = async function (author) {
  const booksKeys = Object.keys(books);
  const booksByAuthor = booksKeys.filter(key => books[key].author === author);
  const book = booksByAuthor.map(book => books[book]);
  return book;
}
public_users.get('/author/:author',async function (req, res) {
  const book = await getBookDetailsByAuthor(req.params.author);
  return res.status(200).json({...book});
});

// Get all books based on title
const getBookByTitle = async function (title) {
  const booksKeys = Object.keys(books);
  const booksByAuthor = booksKeys.filter(key => books[key].title === title);
  const book = booksByAuthor.map(book => books[book]);
  return book;
}
public_users.get('/title/:title',async function (req, res) {
  const book = await getBookByTitle(req.params.title);
  return res.status(200).json({...book});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const book = books[req.params.isbn];
  const reviews = book.reviews;
  return res.status(200).json({reviews});
});

module.exports.general = public_users;
