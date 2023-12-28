require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const ejslayout = require("express-ejs-layouts");
const session = require("express-session");
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Middleware
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
// app.use(ejslayout);

app.use(
  session({
    secret: "My Secret String",
    cookie: { maxAge: 600000 },
    resave: false,
    // store: sessionStore,
    saveUninitialized: true,
  })
);

// API Routes
app.use(require("./middlewares/sessionAuth"));
app.use("/api/books", require("./routes/api/books/bookRouter"));
app.use("/api/users", require("./routes/api/users/userRouter"));

app.get("/", (req, res) => {
  res.render("LandingPage");
});
app.get("/Web", (req, res) => {
  res.render("Web");
});
app.get("/App", (req, res) => {
  res.render("App");
});

// Start server
const port = 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

// Connect to MongoDB
const connectionString = process.env.DATABASE_URL;
const connection = mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB..." + connectionString);
  })
  .catch((err) => console.error("Could not connect to MongoDB..."));
