"use strict";

const express = require("express"),
  app = express(),
  layouts = require("express-ejs-layouts"),
  mongoose = require("mongoose"),
  errorController = require("./controllers/errorController"),
  homeController = require("./controllers/homeController"),
  subscribersController = require("./controllers/subscribersController"),
  usersController = require("./controllers/usersController"),
  coursesController = require("./controllers/coursesController"),
  Subscriber = require("./models/subscriber");
  const User = require("./models/user");

mongoose.Promise = global.Promise;

mongoose.connect(
  "mongodb://0.0.0.0:27017/recipe_db",
  { useNewUrlParser: true }
);
mongoose.set("useCreateIndex", true);

const db = mongoose.connection;

db.once("open", () => {
  console.log("Successfully connected to MongoDB using Mongoose!");
});

Subscriber.create({
    name: "Zlatan",
  email: "zlatan@email.com",
  zipCode: 12345
});


let testUser;

User.create({
  name: {
    first: "Zlatan",
    last: "Ibrahimovic"
  },
  email: "zlatan@email.com",
  password: "pass123"
})
.then(user => {
  testUser = user;
  return Subscriber.findOne({ email: user.email });
})
.then(subscriber => {
  testUser.subscribedAccount = subscriber;
  return testUser.save();
})
.then(user => {
  console.log("User updated:", user);
  mongoose.connection.close(); // close DB connection after finished
})
.catch(error => {
  console.error("Error:", error.message);
  mongoose.connection.close();
});

