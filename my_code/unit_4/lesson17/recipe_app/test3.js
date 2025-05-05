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


const subscriberData = [
  { name: "Peter", email: "peter@example.com", zipCode: 12345 },
  { name: "John", email: "john@example.com", zipCode: 23456 },
  { name: "Andrew", email: "andrew@example.com", zipCode: 34567 },
  { name: "Nathaniel", email: "nath@example.com", zipCode: 45678 },
  { name: "James", email: "james@example.com", zipCode: 56789 },
  { name: "Simon", email: "simon@example.com", zipCode: 67890 },
  { name: "Paul", email: "paul@example.com", zipCode: 78901 },
  { name: "David", email: "david@example.com", zipCode: 89012 },
  { name: "Solomon", email: "solomon@example.com", zipCode: 90123 },
  { name: "Moses", email: "moses@example.com", zipCode: 11223 },
  { name: "Gideon", email: "gideon@example.com", zipCode: 22334 },
  { name: "Jack", email: "jack@example.com", zipCode: 33445 }
];

const courseData = [
    { title: "Mastering Meme Creation", description: "Learn to craft viral memes and rule the internet.", items: ["Meme Templates", "Caption Writing"], zipCode: 12345 },
    { title: "Ultimate Pizza Making", description: "Become a pizza chef in your own kitchen.", items: ["Dough Techniques", "Sauce Secrets"], zipCode: 23456 },
    { title: "Wizardry 101", description: "An introduction to spells, potions, and magical creatures.", items: ["Levitation Spell", "Potion Brewing"], zipCode: 34567 },
    { title: "Space Travel for Beginners", description: "Explore the basics of leaving Earth safely.", items: ["Rocket Science", "Zero Gravity Tips"], zipCode: 45678 },
    { title: "Master the Lightsaber", description: "Learn lightsaber combat like a Jedi Knight.", items: ["Form I - Shii-Cho", "Form V - Djem So"], zipCode: 56789 },
    { title: "Intro to Stand-Up Comedy", description: "Write and perform your own stand-up routine.", items: ["Joke Writing", "Stage Presence"], zipCode: 67890 }
  ];

  Promise.all([
    Subscriber.deleteMany({}),
    Course.deleteMany({})
  ])
  .then(() => {
    return Subscriber.insertMany(subscriberData);
  })
  .then(createdSubscribers => {
    console.log("Subscribers created!");

    return Course.insertMany(courseData).then(createdCourses => {
        console.log("Courses created!");

        const updatePromises = createdSubscribers.map(subscriber => {
            const randomCourse = createdCourses[Math.floor(Math.random() * createdCourses.length)];
            subscriber.courses.push(randomCourse._id);
            return subscriber.save();
          });

          return Promise.all(updatePromises);
    });
})
.then(updatedSubscribers => {
    console.log("Subscribers updated with random courses!");

    return Subscriber.find({}).populate("courses").exec();

})

.then(populatedSubscribers => {
    populatedSubscribers.forEach(sub => {
      console.log(sub.getInfo());
      console.log("Courses enrolled:", sub.courses.map(c => c.title));
      console.log("------------------------------");
    });
  })
  .catch(err => {
    console.error("Error:", err);
  });
    

