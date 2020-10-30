/* 
  COMP 229 - Web Application Development (SEC. 003)
  Fall 2020 - Midterm test
  Thiago Luiz Batista - Student Number 301110966
  Work completed on 30/10/2020
  books.js Midterm File
*/

// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// define the book model
let book = require('../models/books');

/* GET books List page. READ */
router.get('/', (req, res, next) => {
  // find all books in the books collection
  book.find( (err, books) => {
    if (err)
    {
      return console.error(err);
    }
    else {
      //console.log(books);
      res.render('books',
        {
          title: 'Books',
          books: books
        });
    }
  });
});

//  GET the Book Details page in order to add a new Book
router.get('/add', (req, res, next) => {
  
  // Create the blank values object
  let blankBook = book({
      "Title": " ",
      "Price": " ",
      "Author": " ",
      "Genre": " " 
    });
  
  // Render the details page the with blank values
  res.render('../views/books/details', { title: 'Add Book', books: blankBook });
});

// POST process the Book Details page and create a new Book - CREATE
router.post('/add', (req, res, next) => {
  
  // Pick the inserted values
  let newBook = book({
    "Title": req.body.title,
    "Price": req.body.price,
    "Author": req.body.author,
    "Genre": req.body.genre          
  });
  
  // Create a new object with it
  book.create(newBook, (err, books) => {
    if(err)
    {
      console.log(err);
      res.end(err);
    }
    else
    {
      // refresh the book list
      res.redirect('/books');
    }
  });
});

// GET the Book Details page in order to edit an existing Book
router.get('/edit/:id', (req, res, next) => {
let id = req.params.id;

  // Select the object by it's ID
  book.findById(id, (err, bookToEdit) => {
    if(err)
    {
      console.log(err);
      res.end(err);
    }
      // Render the details page with that object's values
    res.render('../views/books/details', { title: 'Edit Book', books: bookToEdit });
  });
});

// POST - process the information passed from the details form and update the document
router.post('/edit/:id', (req, res, next) => {
  let id = req.params.id;

  // Pick the objects new values
  let updatedBook = book({
    "_id": id,
    "Title": req.body.title,
    "Description": req.body.description,
    "Price": req.body.price,
    "Author": req.body.author,
    "Genre": req.body.genre 
  });

  // Update the object
  book.updateOne({_id: id}, updatedBook, (err) => {
    if(err)
    {
      console.log(err);
      res.end(err);
    }
    // refresh the book list
    res.redirect('/books');
  });
});

// GET - process the delete by user id
router.get('/delete/:id', (req, res, next) => {
let id = req.params.id;

  // Delete chosen object
  book.remove({_id: id}, (err) => {
    if(err)
    {
    console.log(err);
    res.end(err);
    }
    else
    {
    // refresh the book list
    res.redirect('/books');
    }
  });
});

module.exports = router;
