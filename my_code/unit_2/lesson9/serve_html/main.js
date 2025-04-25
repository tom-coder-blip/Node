const homeController = require("./controllers/homeController");
const port = 3000;
const express = require("express");

//initialise express
const app = express();

app.use((req, res, next) => {
    console.log(`request made to: ${req.url}`);
    next();
});

//encodes urls to prevent any routing errors
app.use(
    express.urlencoded({
        extended: false
    })
);

//data will be parsed to JSON format
app.use(express.json());

// app.post("/contact", (req, res) => {
//     res.send("Contact information submitted successfully.");
// });

app.get("/items/:vegetable", homeController.sendReqParam);

app.post("/", homeController.sendPost);

app.post("/sign_up", homeController.userSignUpProcessor);

app.get("/sign_up", (req, res) => {
    res.send(`
        <form action="/sign_up" method="POST">
            <input type="text" name="username" placeholder="Username" required />
            <input type="email" name="email" placeholder="Email" required />
            <input type="password" name="password" placeholder="Password" required />
            <button type="submit">Sign Up</button>
        </form>
    `);
});

app.listen(port, () => {
    console.log(`The Express.js server has started and is listening on port number: ${port}`);
});