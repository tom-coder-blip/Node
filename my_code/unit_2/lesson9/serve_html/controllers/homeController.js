exports.sendReqParam = (req, res) => {
    let veg = req.params.vegetable;
    res.send(`This is the page for ${veg}`);
};

exports.sendPost = (req, res) => {
    console.log(req.body);
    console.log(req.query);
    res.send("POST Successful!");
};

exports.userSignUpProcessor = (req, res) => {
    const { username, email, password } = req.body;

    console.log("User Sign Up Details:");
    console.log(`Username: ${username}`);
    console.log(`Email: ${email}`);

    res.send(`Welcome, ${username}! Your sign-up was successful.`);
};

