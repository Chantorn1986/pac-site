const express = require('express');
const app = express();
const path = require('path');
const mysql = require('mysql2');
const multer = require('multer');
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'dbpac'
})

/*const db = mysql.createConnection({
    host: 'localhost',
    user: 'premier_sa',
    password: 'Premier@021812299',
    database: 'pac_system'
})
*/

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }

    console.log('Connected to MySQL database successfully.');
})

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
})

const upload = multer({ storage });

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    const sql = "SELECT * FROM products";

    db.query(sql, (err, results) => {
        if (err) throw err;

        res.render('home', { 
            title: 'Home',
            products: results
        });
    })
});

app.get('/create', (req, res) => {
    res.render('create');
})

app.post('/create', upload.single('image'), (req, res) => {
    const { name, description } = req.body;
    const image = req.file ? req.file.filename : null;

    const sql = "INSERT INTO products (name, description, image) VALUES(?, ?, ?)";
    db.query(sql, [name, description, image], (err, result) => {
        if (err) throw err;
        res.redirect('/');
    })
})

app.get('/edit/:id', (req, res) => {
    const sql = "SELECT * FROM products WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.render('edit', { product: result[0] });
    });
})

app.post('/edit/:id', upload.single('image'), (req, res) => {
    const { name, description } = req.body;
    const image = req.file ? req.file.filename : req.body.oldImage;

    const sql = "UPDATE products SET name = ?, description = ?, image = ? WHERE id = ?";
    db.query(sql, [name, description, image, req.params.id], (err, result) => {
        if (err) throw err;
        res.redirect('/');
    })
})

app.get('/delete/:id', (req, res) => {
    const sql = "DELETE FROM products WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.redirect('/');
    });
})

app.get('/about', (req, res) => {
    res.render('about', { title: 'About'});
});

app.get('/contact', (req, res) => {
    res.render('contact', { title: 'Contact'});
});
/////////////////////////
app.get('/user', (req, res) => {
    const sql = "SELECT * FROM user";

    db.query(sql, (err, results) => {
        if (err) throw err;

        res.render('user', { 
            title: 'user',
            users: results
        });
    })
});

app.get('/userAdd', (req, res) => {
    res.render('userAdd');
})

app.post('/userAdd', (req, res) => {
    const { userName, userEmail,userPassword,userRole }= req.body;
    const hashedPassword =bcrypt.hashSync(userPassword, 10);
    const sql = "INSERT INTO user (name, email,password,role ) VALUES(?, ?, ?, ?)";
    db.query(sql, [ userName, userEmail, hashedPassword, userRole ], (err, result) => {
        if (err) throw err;

        res.redirect('/user');
    })
})

app.get('/userEdit/:id', (req, res) => {
    const sql = "SELECT * FROM user WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.render('userEdit', { user: result[0] });
    });
})

app.post('/userEdit/:id',(req, res) => {
    const { userNameE, userEmailE,userPasswordE,userRoleE } = req.body;
    
    const hashedPassword = bcrypt.hashSync(userPasswordE, 10);
    const sql = "UPDATE user SET name = ?, email = ?, password = ? , role = ? WHERE id = ?";
    db.query(sql, [userNameE, userEmailE, hashedPassword, userRoleE , req.params.id], (err, result) => {
        if (err) throw err;
        res.redirect('/user');
    })
})

app.get('/userDel/:id', (req, res) => {
    const sql = "DELETE FROM user WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.redirect('/user');
    });
})

////////////////////////
app.listen(3000, () => {
    console.log("Server is running...");
});