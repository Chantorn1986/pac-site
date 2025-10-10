const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const morgan = require('morgan');

app.use(morgan('dev'));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'nodesecret',
  resave: false,
  saveUninitialized: true
}))

app.use('/t', require('./routes/test'));

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

app.use('/pacEcatalog', require('./routes/pacEcatalog'));



app.listen(3000,async () => {
  // await sequelize.sync()
  console.log("Server is running... http://localhost:3000");
});