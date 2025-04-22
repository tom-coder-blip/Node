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

app.get("/items/:vegetable", (req, res) => {
    let veg = req.params.vegetable;
    res.send(`This page is for ${veg}`);
});

app.post("/", (req, res) => {
    console.log(req.body);
    console.log(req.query);
    res.send("POST Successful!");
});

app.listen(port, () => {
    console.log(`The Express.js server has started and is listening on port number: ${port}`);
});