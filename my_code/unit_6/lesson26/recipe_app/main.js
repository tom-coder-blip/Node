"use strict";

// Import required modules
const express = require("express"),
  app = express(), // Create an Express application
  router = require("./routes/index"), // Import the main router
  layouts = require("express-ejs-layouts"), // Use EJS layouts for views
  mongoose = require("mongoose"), // Mongoose for MongoDB interaction
  methodOverride = require("method-override"), // Allow overriding HTTP methods
  expressSession = require("express-session"), // Handle session data
  cookieParser = require("cookie-parser"), // Parse cookies
  connectFlash = require("connect-flash"), // Flash messages for sessions
  expressValidator = require("express-validator"), // Middleware for validation
  passport = require("passport"), // Authentication middleware
  errorController = require("./controllers/errorController"), // Error controller
  homeController = require("./controllers/homeController"), // Home page controller
  subscribersController = require("./controllers/subscribersController"), // Subscribers controller
  usersController = require("./controllers/usersController"), // Users controller
  coursesController = require("./controllers/coursesController"), // Courses controller
  User = require("./models/user"); // User model

mongoose.Promise = global.Promise; // Set Mongoose to use native ES6 Promises

// Connect to MongoDB
mongoose.connect(
  "mongodb://0.0.0.0:27017/recipe_db",
  { useNewUrlParser: true }
);
mongoose.set("useCreateIndex", true); // Avoid deprecation warning for ensureIndex()

const db = mongoose.connection; // Reference to the database connection

// Log when MongoDB connection is open
db.once("open", () => {
  console.log("Successfully connected to MongoDB using Mongoose!");
});

app.set("port", process.env.PORT || 3000); // Set the port number for the server
app.set("view engine", "ejs"); // Set EJS as the template engine

app.use(express.static("public")); // Serve static files from the 'public' folder
app.use(layouts); // Use express-ejs-layouts middleware

// Parse URL-encoded bodies (form data)
app.use(
  express.urlencoded({
    extended: false
  })
);

// Enable method override for supporting PUT and DELETE via forms
app.use(
  methodOverride("_method", {
    methods: ["POST", "GET"]
  })
);

app.use(express.json()); // Parse incoming JSON requests
app.use(cookieParser("secret_passcode")); // Use cookie parser with a secret passcode

// Configure session handling
app.use(
  expressSession({
    secret: "secret_passcode", // Secret for signing the session ID cookie
    cookie: {
      maxAge: 4000000 // Set session cookie lifespan
    },
    resave: false, // Don’t save session if unmodified
    saveUninitialized: false // Don’t create session until something is stored
  })
);

// Initialize Passport for authentication
app.use(passport.initialize());
app.use(passport.session()); // Enable persistent login sessions

// Configure Passport to use the User model for authentication
passport.use(User.createStrategy()); 
passport.serializeUser(User.serializeUser()); // Serialize user to session
passport.deserializeUser(User.deserializeUser()); // Deserialize user from session

app.use(connectFlash()); // Use flash messages for success/error notifications

// Middleware to set local variables accessible in views
app.use((req, res, next) => {
  res.locals.loggedIn = req.isAuthenticated(); // Track login status
  res.locals.currentUser = req.user; // Current user data
  res.locals.flashMessages = req.flash(); // Flash messages
  next();
});

app.use(expressValidator()); // Apply validation middleware

app.use("/", router); // Mount the main router on the root path

// Start the server
app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});