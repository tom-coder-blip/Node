"use strict";

const mongoose = require("mongoose");
const { Schema } = mongoose;
const Subscriber = require("./subscriber");

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

//This is Mongoose middleware that runs before a User document is saved to the MongoDB database.
userSchema.pre("save", function (next) { //This registers a pre-save hook (middleware) for the User schema.
  let user = this;
  if (user.subscribedAccount === undefined) {
    Subscriber.findOne({
      email: user.email//link by email address
    })
      .then(subscriber => {
        user.subscribedAccount = subscriber;
        next();
      })
      .catch(error => {
        console.log(`Error in connecting subscriber: ${error.message}`);
        next(error);
      });
  } else {
    next();
  }
});

module.exports = mongoose.model("User", userSchema);
