const express = require('express');
const app = express();
const path = require('path');
const mysql = require('mysql2');
const session = require('express-session');
const multer = require('multer');

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'nodesecret',
    resave: false,
    saveUninitialized: true
}))

app.use('/',require('./routes/login'));

app.use('/user',require('./routes/user'));

app.use('/department',require('./routes/department'));

app.use('/workLevel',require('./routes/workLevel'));

app.use('/position',require('./routes/position'));

app.use('/tableTest',require('./routes/tableTest'));

app.use('/employee',require('./routes/employee'));

app.use('/stockCard',require('./routes/stockCard'));
app.use('/stockCardGoods',require('./routes/stockCardGoods'));
app.use('/stockCardBrands',require('./routes/stockCardBrands'));
app.use('/stockCardStatus',require('./routes/stockCardStatus'));


function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    } else {
        res.redirect('/login');
    }
}

app.get('/about',isAuthenticated, (req, res) => {
    res.render('about', { 
        title: 'About',
        user: req.session.user 
    });
});

app.get('/contact',isAuthenticated, (req, res) => {
    res.render('contact', { 
        title: 'Contact',
        user: req.session.user 
    });
});

app.listen(3000, () => {
    console.log("Server is running...");
});