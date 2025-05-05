const mongoose = require("mongoose");
const Subscriber = require("./models/subscriber");
const express = require("express");
const app = express();
const Course = require("./models/course");

mongoose.connect("mongodb://0.0.0.0:27017/recipe_db",
  { useNewUrlParser: true }
);

const db = mongoose.connection;

db.once("open", () => {
  console.log("Successfully connected to MongoDB using Mongoose!");

});

app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.json());

const bigChief = new Subscriber({
  name: "Big Chief",
  email: "bigchief@email.com",
  zipCode: 82691
});

console.log(bigChief.getInfo());

bigChief.save()
.then(savedSubscriber => {
  console.log("Subscriber saved successfully:", savedSubscriber);

  const newCourse = new Course({
    title: "Making Tacos",
    description: "Learn the basics of making tacos.",
    items: ["Cheese", "Sauce", "Taco Bread"],
    zipCode: 87232
  });

  return newCourse.save().then(savedCourse => {
    console.log("Course saved successfully:", savedCourse);

    // Link the course to the subscriber
    savedSubscriber.courses.push(savedCourse._id);

    // Save the updated subscriber with the course reference
    return savedSubscriber.save();
  });
})
.then(updatedSubscriber => {
  console.log("Updated Subscriber with linked course:", updatedSubscriber);
})
.catch(error => {
  console.error("Error occurred:", error);
});
