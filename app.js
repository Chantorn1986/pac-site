const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const {isAuthenticated} = require('./middlewares/authCheck')

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'nodesecret',
  resave: false,
  saveUninitialized: true
}))

app.use('/', require('./routes/login'));

app.use('/menuRole', require('./routes/menuRole'));

app.use('/user', require('./routes/user'));

app.use('/department', require('./routes/department'));

app.use('/workLevel', require('./routes/workLevel'));

app.use('/position', require('./routes/position'));

app.use('/employee', require('./routes/employee'));

app.use('/tableTest', require('./routes/tableTest'));

app.use('/timeAtt', require('./routes/timeAttendance'));

app.use('/library', require('./routes/library'));

app.use('/leave', require('./routes/leave'));

app.use('/itHelpdesk', require('./routes/itHelpdesk'));

app.use('/stockCard', require('./routes/stockCard'));


// app.get('/about', isAuthenticated, (req, res) => {
//   res.render('about', {
//     title: 'About',
//     user: req.session.user
//   });
// });

// app.get('/contact', isAuthenticated, (req, res) => {
//   res.render('contact', {
//     title: 'Contact',
//     user: req.session.user
//   });
// });

app.listen(3000, () => {
  console.log("Server is running...");
});