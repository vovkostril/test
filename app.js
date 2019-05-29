const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const staticAsset = require('static-asset');
const mongoose = require('mongoose');
const session = require('express-session');

const MongoStore = require('connect-mongo')(session);

const User = require('./models/user');
const config = require('./config');
const routes = require('./routes');

//database
mongoose.Promise = global.Promise;
mongoose.set('debug', config.IS_PRODUCTION);

mongoose.connection
    .on('error', error => console.log(error))
    .on('close', () => console.log('Database connection closed.'))
    .once('open', () => {
        const info = mongoose.connections[0];
        console.log(`Connected to ${info.host}:${info.port}/${info.name}`);
    });
mongoose.connect(config.MONGO_URL, { useNewUrlParser: true });

//express
const app = express();

//session
app.use(
    session({
        secret: config.SESSION_SECRET,
        resave: true,
        saveUninitialized: false,
        store: new MongoStore({
            mongooseConnection: mongoose.connection
        })
    })
);

//sets and uses
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(staticAsset(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
    'javascripts',
    express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist'))
);

//routes
app.get('/', (req, res) => {
    User.find({})
        .then(user => {
            res.render('index', { users: user });
        })
        .catch(err => {
            res.status(200).json({ err: err });
        });
});

/*app.get('/create', (req, res) => res.render('create'));
app.post('/create', (req, res) => {
    const { name, password } = req.body;

    User.create({
            name: name,
            password: password
        }) //.then(user => console.log(user.id + user.name));

    res.redirect('/');
});*/


/*
app.get('/login', (req, res) => res.render('login'));
app.post('/login', (req, res) => {

    

    res.redirect('/');
});*/

app.get('/contacts', (req, res) => res.render('contacts'));
app.get('/about', (req, res) => res.render('about'));



app.get('/', (req, res) => {
    const id = req.session.userId;
    const login = req.session.userLogin;

    res.render('index', {
        user: {
            id,
            login
        }
    });
});
app.use('/api/auth', routes.auth);

//catch 404 and forvard to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//error handler
//eslint-disable-next-line no-unuses-vars
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.render('error', {
        message: error.message,
        error: !config.IS_PRODUCTION ? error : {}
    });
});



app.listen(config.PORT, () =>
    console.log(`Example app listening on port ${config.PORT}!`)
);