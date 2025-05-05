const mongoose = require("mongoose");
const Subscriber = require("./models/subscriber");
const Course = require("./models/course");
const express = require("express");

const app = express();

mongoose.connect("mongodb://0.0.0.0:27017/recipe_db", {
  useNewUrlParser: true,
});

const db = mongoose.connection;

db.once("open", async () => {
  console.log("Successfully connected to MongoDB using Mongoose!");

  app.use(
    express.urlencoded({
      extended: false,
    })
  );
  app.use(express.json());

  // Create a course
  const testCourse = await Course.create({
    title: "Tomato Land",
    description: "Locally farmed tomatoes only",
    zipCode: 12345,
    items: ["cherry", "heirloom"],
  });

  // Create subscribers
  const subscribers = [
    { name: "Tom", email: "tom@email.com", zipCode: 12345 },
    { name: "Bob", email: "bob@email.com", zipCode: 12345 },
    { name: "Cathy", email: "cathy@email.com", zipCode: 12345 },
    { name: "David", email: "david@email.com", zipCode: 12345 },
    { name: "Ella", email: "ella@email.com", zipCode: 12345 },
    { name: "Frank", email: "frank@email.com", zipCode: 54321 },
    { name: "Grace", email: "grace@email.com", zipCode: 23456 },
    { name: "Henry", email: "henry@email.com", zipCode: 34567 },
    { name: "Isabel", email: "isabel@email.com", zipCode: 45678 },
    { name: "James", email: "james@email.com", zipCode: 56789 },
  ];

  await Subscriber.insertMany(subscribers);
  console.log("Subscribers added successfully.");

  // Create a test subscriber
  const testSubscriber = await Subscriber.create({
    name: "John",
    email: "john@email.com",
    zipCode: 12345,
  });

  // Link course to subscriber
  testSubscriber.courses = [testCourse._id];
  await testSubscriber.save();

  const populatedSubscriber = await Subscriber.populate(testSubscriber, "courses");
  console.log("Populated subscriber:");
  console.log(populatedSubscriber);

  // Create Bigman
  const bigman = await Subscriber.create({
    name: "Bigman",
    email: "bigman@email.com",
    zipCode: 54321,
  });

  console.log("Bigman info:");
  console.log(bigman);

  const toolz = await Subscriber.create({
    name: "Toolz",
    email: "tools@email.com",
    zipCode: 49021
  });

  await toolz.save();

  console.log(toolz);

  // Close DB connection after all operations
  mongoose.connection.close();
});