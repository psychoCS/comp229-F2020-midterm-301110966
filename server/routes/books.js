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
      res.render('books/index',
      {
        title: 'Books',
        books: books
      })
    }
  });
});

//  GET the Book Details page in order to add a new Book
router.get('/add', (req, res, next) => {
  res.render('books/details', { title: 'Add Book' })
});

// POST process the Book Details page and create a new Book - CREATE
router.post('/add', (req, res, next) => {
  let newBook = book({
    "title": req.body.title,
    "description": req.body.description,
    "price": req.body.price,
    "author": req.body.author,
    "published": req.body.published          
      });

  book.create(newBook, (err, books) =>{
    if(err)
    {
      console.log(err);
      res.end(err);
    }
    else
    {
    // refresh the book list
    res.redirect('books/details');
    }
  });
});

// GET the Book Details page in order to edit an existing Book
router.get('/:id', (req, res, next) => {
let id = req.params.id;

  book.findById(id, (err, bookToEdit) => {
    if(err)
    {
      console.log(err);
    res.end(err);
    }
    else
    {
    //show the edit view
      res.render('books/details', {title: 'Edit Book', book: bookToEdit})
    }
  });
});

// POST - process the information passed from the details form and update the document
router.post('/:id', (req, res, next) => {
  let id = req.params.id

  let updatedBook = book({
    "_id": id,
    "title": req.body.title,
    "description": req.body.description,
    "price": req.body.price,
    "author": req.body.author,
    "published": req.body.published 
  });

  book.updateOne({_id: id}, updatedBook, (err) => {
    if(err)
    {
      console.log(err);
      res.end(err);
    }
    else
    {
    // refresh the book list
    res.redirect('books/details');
    }
  });
});

// GET - process the delete by user id
router.get('/delete/:id', (req, res, next) => {
let id = req.params.id;

  book.remove({_id: id}, (err) => {
    if(err)
    {
    console.log(err);
    res.end(err);
    }
    else
    {
    // refresh the book list
    res.redirect('books/details');
    }
  });
});

module.exports = router;
