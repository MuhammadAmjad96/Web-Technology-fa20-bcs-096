const express = require("express");
const router = express.Router();
const checkSessionAuth = require("../../../middlewares/checkSessionAuth");
const { body, validationResult } = require("express-validator");

const Book = require("../../../models/Book");

// Validation middleware for adding a book
const validateAddBook = [
  body("name").notEmpty().withMessage("Name cannot be empty"),
  body("author").notEmpty().withMessage("Author cannot be empty"),
  body("price").notEmpty().withMessage("Price cannot be empty").isNumeric().withMessage("Price must be a number"),
];

// Validation middleware for editing a book
const validateEditBook = [
  body("name").notEmpty().withMessage("Name cannot be empty"),
  body("author").notEmpty().withMessage("Author cannot be empty"),
  body("price").notEmpty().withMessage("Price cannot be empty").isNumeric().withMessage("Price must be a number"),
];

// Get add book page
router.get("/add", checkSessionAuth, (req, res) => {
  res.render("book-store/add-book");
});

// Add a new book
router.post("/add", validateAddBook, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render("book-store/add-book", { errors: errors.array() });
  }

  const { name, author, price } = req.body;

  const book = new Book({
    name: name,
    author: author,
    price: price,
  });

  try {
    const savedBook = await book.save();
    res.redirect("/api/books/books");
  } catch (error) {
    console.error("Error saving book:", error);
    res.status(500).send("Error saving book");
  }
});

// Edit a book - get the book to edit
router.get("/edit/:id", async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).send("Book not found");
  res.render("book-store/edit-book", { book });
});

// Edit a book - post the book after modification
router.post("/edit/:id", validateEditBook, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const book = await Book.findById(req.params.id);
    return res.status(400).render("book-store/edit-book", { errors: errors.array(), book });
  }

  const { name, author, price } = req.body;
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).send("Book not found");
  book.name = name;
  book.author = author;
  book.price = price;

  try {
    await book.save();
    res.redirect("/api/books/books");
  } catch (error) {
    console.error("Error saving edited book:", error);
    res.status(500).send("Error saving edited book");
  }
});

// Other routes...


