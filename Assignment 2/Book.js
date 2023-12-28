const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
  name: String,
  Author: String,
  price: Number,
});

const Book = mongoose.model("books", bookSchema);
module.exports = Book;
