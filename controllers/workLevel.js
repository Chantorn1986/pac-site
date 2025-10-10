const { v4: uuidv4 } = require("uuid");
const moment = require('moment');
const db = require('../models/workLevel');


exports.list = async (req, res) => {
  try {
    const results = await db.findAll();
    res.render('dataDDL/workLevel', {
      title: 'Work Level Management',
      workLevel: results,
      user: req.session.user
    })
  } catch (err) {
    console.error('Error list data:', err)
    res.status(500).json({ error: 'List work level invalid.' })
  }
}

exports.getCreate = async (req, res) => {
  try {
    res.render('dataDDL/workLevelAdd', {
      title: 'Work Level Create',
      updatedAt: moment(new Date()).format('DD/MM/YYYY HH:mm:ss'),
      user: req.session.user
    })
  } catch {
    console.error('Error get data:', err)
    res.status(500).json({ error: 'Get create work level invalid.' })
  }
}

exports.postCreate = async (req, res) => {
  try {
    const { workLevelNo, workLevelCode, workLevelNameTH, workLevelNameEN } = req.body;
    const newResults = await db.create({
      id: uuidv4(),
      no: workLevelNo,
      code: workLevelCode,
      nameTH: workLevelNameTH,
      nameEN: workLevelNameEN
    })
    const results = await db.findAll();
    res.render('dataDDL/workLevel', {
      title: 'Work Level Management',
      workLevel: results,
      user: req.session.user
    })
  } catch {
    console.error('Error post data :', err)
    res.status(500).json({ error: 'Post create work level invalid.' })
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
    res.render('dataDDL/workLevelEdit', {
      title: 'Work Level Edit',
      workLevel: result,
      coverDate: coverDate,
      user: req.session.user
    })
  } catch {
    console.error('Error get data :', err)
    res.status(500).json({ error: 'Get update work level invalid.' })
  }
}

exports.putUpdate = async (req, res) => {
  try {
    const { workLevelNoE, workLevelCodeE, workLevelNameTHE, workLevelNameENE } = req.body;
    await db.update({
      no: workLevelNoE,
      code: workLevelCodeE,
      nameTH: workLevelNameTHE,
      nameEN: workLevelNameENE,
      updatedAt: moment(new Date()).format()
    }, {
      where: {
        id: req.params.id
      }
    });
    const results = await db.findAll();
    res.render('dataDDL/workLevel', {
      title: 'Work Level Management',
      workLevel: results,
      user: req.session.user
    })
  } catch {
    console.error('Error put data :', err);
    res.status(500).json({ error: 'Put update work level invalid.' })
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
    res.render('dataDDL/workLevel', {
      title: 'Work Level Management',
      workLevel: results,
      user: req.session.user
    })
  } catch {
    console.error('Error get remove data :', err)
    res.status(500).json({ error: 'Get remove work level invalid.' })
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
    res.render('dataDDL/workLevelView', {
      title: 'Work Level View',
      workLevel: result,
      coverDate: coverDate,
      user: req.session.user
    })
  } catch {
    console.error('Error get data:', err)
    res.status(500).json({ error: 'Get view work level invalid.' })
  }
}