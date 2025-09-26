const { v4: uuidv4 } = require("uuid");
const bcrypt = require('bcryptjs');
const db = require('../models/user');

async function hashPassword(password) {
  try {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  } catch (err) {
    console.error('Error hashing password:', err);
    throw err;
  }
}

exports.list = async (req, res) => {
  try {
    const results = await db.findAll();
      res.render('userLogin/user', {
        title: 'Users Management',
        users: results,
        user: req.session.user
      })
  } catch (err) {
    console.error('Error list data :', err)
    res.status(500).json({ error: 'List users invalid.' })
  }
}

exports.getCreate = async (req, res) => {
  try {
    res.render('userLogin/userAdd', {
      title: 'Users Create',
      updatedAt: moment(new Date()).format('DD/MM/YYYY HH:mm:ss'),
      user: req.session.user
    })
  } catch {
    console.error('Error get data :', err)
    res.status(500).json({ error: 'Get create users invalid.' })
  }
}

exports.postCreate = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const newResults = await db.create({
      id: uuidv4(),
      name: name,
      email: email,
      password: bcrypt.hashSync(password, 10),
      role: role
    })
    const results = await db.findAll();
        res.render('userLogin/user', {
          title: 'Users Management',
          users: results,
          user: req.session.user
        })
  } catch (err) {
    console.error('Error post data :', err)
    res.status(500).json({ error: 'Post create user invalid.' })
  }
}

exports.getUpdate = async (req, res) => {
  try {
        const result = await db.findOne({ where: { id: req.params.id } });
    const coverDate = {
      createdAt: null,
      updatedAt: null
    }
    if (result.createdAt) {
      coverDate.createdAt = moment(result.createdAt).format('DD/MM/YYYY HH:mm:ss');
    }
    if (result.updatedAt) {
      coverDate.updatedAt = moment(result.updatedAt).format('DD/MM/YYYY HH:mm:ss');
    }
      res.render('userLogin/userEdit', {
        title: 'Users Edit',
        users: result,
        coverDate: coverDate,
        user: req.session.user
      })
  } catch (err) {
    console.error('Error get data :', err)
    res.status(500).json({ error: 'Get update user invalid.' })
  }
}

exports.putUpdate = async (req, res) => {
  // const encodedData = Buffer.from(passwordE).toString('base64');
  try {
    const { nameE, emailE, passwordE, roleE } = req.body;
    // const hashedPassword = bcrypt.hashSync(passwordE, 10);
    const hashedPassword = await hashPassword(passwordE);
        await db.update({
      name: nameE,
      email: emailE,
      password: hashedPassword,
      role: roleE,
      updatedAt: moment(new Date()).format()
    }, {
      where: {
        id: req.params.id
      }
    });
    const results = await db.findAll();
        res.render('userLogin/user', {
          title: 'Users Management',
          users: results,
          user: req.session.user
        })
  } catch (err) {
    console.error('Error put data :', err);
    res.status(500).json({ error: 'Put update user invalid.' })
  }
}

exports.getRemove = async (req, res) => {
  try {
    await db.destroy({
      where: {
        id: req.params.id
      }
    });
    const results = await db.findAll();
        res.render('userLogin/user', {
          title: 'Users Management',
          users: results,
          user: req.session.user
        })

  } catch (err) {
    console.error('Error get remove data :', err)
    res.status(500).json({ error: 'Get remove user invalid.' })
  }
}

exports.getView = async (req, res) => {
  try {
        const result = await db.findOne({ where: { id: req.params.id } });
    const coverDate = {
      createdAt: null,
      updatedAt: null
    }
    if (result.createdAt) {
      coverDate.createdAt = moment(result.createdAt).format('DD/MM/YYYY HH:mm:ss');
    }
    if (result.updatedAt) {
      coverDate.updatedAt = moment(result.updatedAt).format('DD/MM/YYYY HH:mm:ss');
    }
      res.render('userLogin/userView', {
        title: 'Users View',
        users: result,
        coverDate: coverDate,
        user: req.session.user
      })
  } catch (err) {
    console.error('Error get data:', err)
    res.status(500).json({ error: 'Get view user invalid.' })
  }
}