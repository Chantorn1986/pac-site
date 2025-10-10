// const db = require("../db/db.js");
const { v4: uuidv4 } = require("uuid");
const db = require('../models/user');

exports.list = async (req, res) => {
  try {
    const results = await db.findAll();
      res.json({
        title: 'Users Management',
        users: results
      })
  } catch (err) {
    console.error('Error list data :', err)
    res.json({ message:"List users invalid."}).status(5000);
  }
}

exports.getCreate = async (req, res) => {
  try {
    const {name,email,password,role} =req.body
  } catch {
    console.error('Error get data :', err)
    res.status(500).json({ error: 'Get create users invalid.' })
  }
}

exports.postCreate = async (req, res) => {
  try {
    // const {name,email,password,role} =req.body
    // const result = await prisma.user.create({
    //   data:{
    //     name:name,
    //     email:email,
    //     password:password,
    //     role:role,
    //   },
    // });
    // res.json({result});
  } catch (err) {
    console.error('Error post data :', err)
    res.status(500).json({ error: 'Post create user invalid.' })
  }
}

exports.getUpdate = async (req, res) => {
  try {

  } catch (err) {
    console.error('Error get data :', err)
    res.status(500).json({ error: 'Get update user invalid.' })
  }
}

exports.putUpdate = async (req, res) => {
  try {

  } catch (err) {
    console.error('Error put data :', err);
    res.status(500).json({ error: 'Put update user invalid.' })
  }
}

exports.getRemove = async (req, res) => {
  try {

  } catch (err) {
    console.error('Error get remove data :', err)
    res.status(500).json({ error: 'Get remove user invalid.' })
  }
}

exports.getView = async (req, res) => {
  try {

  } catch (err) {
    console.error('Error get data:', err)
    res.status(500).json({ error: 'Get view user invalid.' })
  }
}