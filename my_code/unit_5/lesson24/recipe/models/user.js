"use strict";

const mongoose = require("mongoose");
//const bcrypt = require("bcrypt");//encrypt user passwords
const { Schema } = mongoose;
const Subscriber = require("./subscriber");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema(
  {
    name: {
      first: {
        type: String,
        trim: true
      },
      last: {
        type: String,
        trim: true
      }
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true
    },
    zipCode: {
      type: Number,
      min: [1000, "Zip code too short"],
      max: 99999
    },
    password: {
      type: String,
      required: true
    },
    courses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
    subscribedAccount: {
      type: Schema.Types.ObjectId,
      ref: "Subscriber"
    }
  },
  {
    timestamps: true
  }
);

userSchema.virtual("fullName").get(function () {
  return `${this.name.first} ${this.name.last}`;
});

//links user to an existing subscriber
userSchema.pre("save", function (next) {
  let user = this;
  if (user.subscribedAccount === undefined) {
    Subscriber.findOne({
      email: user.email
    })
      .then(subscriber => {
        user.subscribedAccount = subscriber;
        next();
      })
      .catch(error => {
        console.log(`Error in connecting subscriber:${error.message}`);
        next(error);
      });
  } else {
    next();
  }
});

//hashes users password
// userSchema.pre("save", function (next) {
//   let user = this;
//   bcrypt
//     .hash(user.password, 10)
//     .then(hash => {
//       user.password = hash;
//       next();
//     })
//     .catch(error => {
//       console.log(`Error in hashing password: ${error.message}`);
//       next(error);
//     });
// });

// userSchema.methods.passwordComparison = function (inputPassword) {
//   let user = this;
//   return bcrypt.compare(inputPassword, user.password);
// };

//It simplifies setting up a username/password login with Passport.
userSchema.plugin(passportLocalMongoose, {
  usernameField: "email"
});

module.exports = mongoose.model("User", userSchema);
