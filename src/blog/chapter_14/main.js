const express = require('express'); // Import Express framework to build the web server
const path = require('path'); // Node.js module for handling file and directory paths
const newPostController = require('./controllers/newPost'); // Controller to render the new post creation page
const newUserController = require('./controllers/newUser'); // Controller to render the user registration page
const storeUserController = require('./controllers/storeUser'); // Controller to handle storing new user data
const storePostController = require('./controllers/storePost'); // Controller to handle saving new blog posts
const loginController = require('./controllers/login'); // Controller to render the login page
const loginUserController = require('./controllers/loginUser'); // Controller to handle user login logic
const authMiddleware = require('./middleware/authMiddleware'); // Middleware to protect routes for authenticated users
const redirectIfAuthenticatedMiddleware = require('./middleware/redirectIfAuthenticatedMiddleware'); // Middleware to redirect logged-in users away from auth routes
const logoutController = require('./controllers/logout'); // Controller to handle user logout
const flash = require('connect-flash'); // Middleware for flash messages (e.g., success/error notifications)
const session = require('express-session'); // Middleware to handle user sessions
const bodyParser = require('body-parser'); // Middleware to parse incoming request bodies
const mongoose = require('mongoose'); // ODM library for MongoDB to interact with the database
const BlogPost = require('./models/BlogPost'); // Mongoose model representing a blog post
const fileUpload = require('express-fileupload'); // Middleware to handle file uploads

const app = express(); //create express app
const ejs = require('ejs'); //using ejs templates
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost/my_blog', { useUnifiedTopology: true, useNewUrlParser: true });

const PORT = 4000;

// Session middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));

// Flash middleware
app.use(flash());

global.loggedIn = null;
app.use("*", (req, res, next) => {
    loggedIn = req.session.userId;
    next();
});

app.use(fileUpload());

app.listen(PORT, () => {
    console.log('App listening on port 4000');
});

// Routes

//Loads the home page and shows all blog posts.
app.get('/', async (req, res) => {
    const blogposts = await BlogPost.find({}).populate();
    res.render('index', {
        blogposts: blogposts
    });
});

//Renders static pages like About, Contact, etc.
app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.get('/samplepost', (req, res) => {
    res.render('samplepost');
});

//Displays a specific blog post by ID.
app.get('/post/:id', async (req, res) => {
    const blogpost = await BlogPost.findById(req.params.id)
    res.render('post', {
        blogpost: blogpost
    });
});

//renders the create page to create a new blogpost
app.get('/create', (req, res) => {
    res.render('create');
});

//Handles form submission for new posts:
app.post('/posts/store', async (req, res) => {
    try {
        let image = req.files.image;
        await image.mv(path.resolve(__dirname, 'public/img', image.name));
        await BlogPost.create({
            ...req.body,
            image: '/img/' + image.name
        });
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Middleware-Protected Routes
app.get('/posts/new', newPostController);
app.post('/posts/store', authMiddleware, storePostController);
//Handles user registration, login, and logout via middleware and controller files
app.get('/auth/register', newUserController);
app.post('/users/register', redirectIfAuthenticatedMiddleware, storeUserController);
app.get('/auth/login', loginController);
app.post('/users/login', redirectIfAuthenticatedMiddleware, loginUserController);
app.get('/auth/logout', logoutController);

app.use((req, res) => res.render('notfound'));

