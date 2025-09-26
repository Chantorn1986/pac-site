const { v4: uuidv4 } = require("uuid");
const moment = require('moment');
const db = require('../models/departments');


exports.list = async (req, res) => {
  try {
    const results = await db.findAll();
    res.render('dataDDL/department', {
      title: 'Department Management',
      departments: results,
      user: req.session.user
    })
  } catch (err) {
    console.error('Error list data :', err)
    res.status(500).json({ error: 'List departments invalid.' })
  }
}

exports.getCreate = async (req, res) => {
  try {
    res.render('dataDDL/departmentAdd', {
      title: 'Department Create',
      updatedAt: moment(new Date()).format('DD/MM/YYYY HH:mm:ss'),
      user: req.session.user
    })
  } catch {
    console.error('Error get data :', err)
    res.status(500).json({ error: 'Get create departments invalid.' })
  }
}

exports.postCreate = async (req, res) => {
  try {
    const { departmentNo, departmentCode, departmentNameTH, departmentNameEN } = req.body;
    const newResults = await db.create({
      id: uuidv4(),
      no: departmentNo,
      code: departmentCode,
      nameTH: departmentNameTH,
      nameEN: departmentNameEN
    })
    const results = await db.findAll();
    res.render('dataDDL/department', {
      title: 'Department Management',
      departments: results,
      user: req.session.user
    })
  } catch (err) {
    console.error('Error post data :', err)
    res.status(500).json({ error: 'Post create departments invalid.' })
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
    res.render('dataDDL/departmentEdit', {
      title: 'Department Edit',
      department: result,
      coverDate: coverDate,
      user: req.session.user
    })
  } catch (err) {
    console.error('Error get data :', err)
    res.status(500).json({ error: 'Get update departments invalid.' })
  }
}

exports.putUpdate = async (req, res) => {
  try {
    const { departmentNoE, departmentCodeE, departmentNameTHE, departmentNameENE } = req.body;
    await db.update({
      no: departmentNoE,
      code: departmentCodeE,
      nameTH: departmentNameTHE,
      nameEN: departmentNameENE,
      updatedAt: moment(new Date()).format()
    }, {
      where: {
        id: req.params.id
      }
    });
    const results = await db.findAll();
    res.render('dataDDL/department', {
      title: 'Department Management',
      departments: results,
      user: req.session.user
    })
  } catch (err) {
    console.error('Error put data :', err);
    res.status(500).json({ error: 'Put update departments invalid.' })
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
    res.render('dataDDL/department', {
      title: 'Department Management',
      departments: results,
      user: req.session.user
    })
  } catch (err) {
    console.error('Error get remove data :', err)
    res.status(500).json({ error: 'Get remove departments invalid.' })
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
    res.render('dataDDL/departmentView', {
      title: 'Department View',
      department: result,
      coverDate: coverDate,
      user: req.session.user
    })
  } catch (err) {
    console.error('Error get data:', err)
    res.status(500).json({ error: 'Get view departments invalid.' })
  }
}


