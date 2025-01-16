const express = require('express');
const app = express();
const path = require('path');
const mysql = require('mysql2');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require("uuid");

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
///////////////////////////////////////////////////////////  User
app.get('/user', (req, res) => {
    const sql = "SELECT * FROM users";

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
    const sql = "INSERT INTO users (name, email,password,role ) VALUES(?, ?, ?, ?)";
    db.query(sql, [ userName, userEmail, hashedPassword, userRole ], (err, result) => {
        if (err) throw err;

        res.redirect('/user');
    })
})

app.get('/userEdit/:id', (req, res) => {
    const sql = "SELECT * FROM users WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.render('userEdit', { user: result[0] });
    });
})

app.post('/userEdit/:id',(req, res) => {
    const { userNameE, userEmailE,userPasswordE,userRoleE } = req.body;
    
    const hashedPassword = bcrypt.hashSync(userPasswordE, 10);
    const sql = "UPDATE users SET name = ?, email = ?, password = ? , role = ? WHERE id = ?";
    db.query(sql, [userNameE, userEmailE, hashedPassword, userRoleE , req.params.id], (err, result) => {
        if (err) throw err;
        res.redirect('/user');
    })
})

app.get('/userDel/:id', (req, res) => {
    const sql = "DELETE FROM users WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.redirect('/user');
    });
})

///////////////////////////////////////////////////////////  Department
app.get('/department', (req, res) => {
    const sql = "SELECT * FROM departments";

    db.query(sql, (err, results) => {
        if (err) throw err;

        res.render('department', { 
            title: 'department',
            departments: results
        });
    })
});

app.get('/departmentAdd', (req, res) => {
    res.render('departmentAdd');
})

app.post('/departmentAdd', (req, res) => {
    const { departmentNo, departmentCode,departmentNameTH,departmentNameEN }= req.body;
    //const uuid = uuidv4();
    const sql = "INSERT INTO departments ( no, code, nameTH, nameEN ) VALUES(?, ?, ?, ?)";
    db.query(sql, [ departmentNo, departmentCode,departmentNameTH,departmentNameEN ], (err, result) => {
        if (err) throw err;

        res.redirect('/department');
    })
})

app.get('/departmentEdit/:id', (req, res) => {
    const sql = "SELECT * FROM departments WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.render('departmentEdit', { department: result[0] });
    });
})

app.post('/departmentEdit/:id',(req, res) => {
    const { departmentNoE, departmentCodeE,departmentNameTHE,departmentNameENE } = req.body;
    
    const sql = "UPDATE departments SET no = ?, code = ?, nameTH = ? , nameEN = ? WHERE id = ?";
    db.query(sql, [departmentNoE, departmentCodeE,departmentNameTHE,departmentNameENE , req.params.id], (err, result) => {
        if (err) throw err;
        res.redirect('/department');
    })
})

app.get('/userDel/:id', (req, res) => {
    const sql = "DELETE FROM departments WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) throw err;
        res.redirect('/department');
    });
})

///////////////////////////////////////////////////////////  
app.listen(3000, () => {
    console.log("Server is running...");
});