"use strict";

const express = require("express");
const app = express();
const router = express.Router();
const layouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const errorController = require("./controllers/errorController");
const homeController = require("./controllers/homeController");
const subscribersController = require("./controllers/subscribersController");
const usersController = require("./controllers/usersController");
const coursesController = require("./controllers/coursesController");
const Subscriber = require("./models/subscriber");
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
    name: "Kylian Mbappe",
    email: "kylian@email.com",
    zipCode: 23786
})

User.create({
  name: {
    first: "Kylian",
    last: "Mbappe"
  },
  email: "kylian@email.com",
  password: "ahsb0932"
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