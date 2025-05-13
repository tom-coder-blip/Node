"use strict";

// Create a new Express router instance
const router = require("express").Router();

// Import route modules for different parts of the application
const userRoutes = require("./userRoutes");
const subscriberRoutes = require("./subscriberRoutes");
const courseRoutes = require("./courseRoutes");
const errorRoutes = require("./errorRoutes");
const homeRoutes = require("./homeRoutes");
const apiRoutes = require("./apiRoutes");

// Mount user-related routes under /users
router.use("/users", userRoutes);

// Mount subscriber-related routes under /subscribers
router.use("/subscribers", subscriberRoutes);

// Mount course-related routes under /courses
router.use("/courses", courseRoutes);

// Mount API routes under /api (e.g., REST endpoints)
router.use("/api", apiRoutes);

// Mount home page and other general routes at the root path
router.use("/", homeRoutes);

// Mount error handling routes at the root path (should be last)
router.use("/", errorRoutes);

// Export the router to be used in the main app
module.exports = router;
