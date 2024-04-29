const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    const userwithsamename = users.filter(user=>user.username === username);
    console.log(userwithsamename)
    if(userwithsamename.length){
      return false;
    } else {
      return true;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    const validUser = users.filter(user=>{
      return (user.username === username && user.password === password);
    });
    if(validUser.length){
      return true;
    } else {
      return false;
    }
}




//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
   if (!username || !password) {
    return res.status(403).json({message: "Invalid credentials"});
   }
   if (authenticatedUser(username, password)) {
    const accesToken = jwt.sign({data: password}, 'celoappaccess', { expiresIn: 60 * 60 });
    req.session.authorization = {accesToken, username};
    return res.status(200).json({message: "User successfully logged in."});
   }
  return res.status(207).json({message: "Wrong username or password."});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const book = books[req.params.isbn];
  const user = req.session.authorization['username'];
  const review = book.reviews[user];
  if (review) {
    review.comment = req.query.comment;
    return res.status(200).json({message: `User review for ISBN ${req.params.isbn} was updated.`});
  } else {
    book.reviews[user] = {comment: req.query.comment};
    return res.status(200).json({message: `User review  for ISBN ${req.params.isbn} was added.`});
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const book = books[req.params.isbn];
  const user = req.session.authorization['username'];
  delete book.reviews[user];
  return res.status(202).json({message: `User review for ISBN ${req.params.isbn} was deleted. `});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
