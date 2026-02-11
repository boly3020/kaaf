require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const path = require('path');
const ejsLayouts = require('express-ejs-layouts');
const connectDB = require('./config/db');

const app = express();

// Connect to MongoDB
connectDB();

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(ejsLayouts);
app.set('layout', 'layouts/main');

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Method override for PUT/DELETE in forms
app.use(methodOverride('_method'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
}));

// Global variables for templates
app.use((req, res, next) => {
    res.locals.currentUser = req.session.userId || null;
    res.locals.currentPath = req.path;
    next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/admin', require('./routes/admin'));
app.use('/api', require('./routes/api'));

// 404 handler
app.use((req, res) => {
    res.status(404).render('public/404', {
        layout: 'layouts/main',
        title: 'Page Not Found',
        settings: {}
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`KAAF server running on port ${PORT}`);
});
