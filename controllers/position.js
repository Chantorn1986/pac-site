const { v4: uuidv4 } = require("uuid");
const db = require('../models/positions');
const moment = require('moment');

exports.list = async (req, res) => {
  try {
    const results = await db.findAll();
    res.render('dataDDL/position', {
      title: 'Position Management',
      positions: results,
      user: req.session.user
    })
  } catch (err) {
    console.error('Error list data :', err)
    res.status(500).json({ error: 'List positions invalid.' })
  }
}

exports.getCreate = async (req, res) => {
  try {
    res.render('dataDDL/positionAdd', {
      title: 'Position Create',
      updatedAt: moment(new Date()).format('DD/MM/YYYY HH:mm:ss'),
      user: req.session.user
    })
  } catch {
    console.error('Error get data :', err)
    res.status(500).json({ error: 'Get create positions invalid.' })
  }
}

exports.postCreate = async (req, res) => {
  try {
    const { positionNo, positionNameTH, positionNameEN } = req.body;
    const newResults = await db.create({
      id: uuidv4(),
      no: positionNo,
      nameTH: positionNameTH,
      nameEN: positionNameEN
    })
    const results = await db.findAll();
    res.render('dataDDL/position', {
      title: 'Position Management',
      positions: results,
      user: req.session.user
    })
  } catch (err) {
    console.error('Error post data :', err)
    res.status(500).json({ error: 'Post create positions invalid.' })
  }
}

exports.getUpdate = async (req, res) => {
  try {
    const result = await db.findOne({ where: { id: [req.params.id] } });
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
    res.render('dataDDL/positionEdit', {
      title: 'Position Edit',
      position: result,
      coverDate: coverDate,
      user: req.session.user
    })
  } catch (err) {
    console.error('Error get data :', err)
    res.status(500).json({ error: 'Get update positions invalid.' })
  }
}

exports.putUpdate = async (req, res) => {
  try {
    const paramID = req.params.id;
    const { positionNoE, positionNameTHE, positionNameENE } = req.body;
    await db.update({
      no: positionNoE,
      nameTH: positionNameTHE,
      nameEN: positionNameENE,
      updatedAt: moment(new Date()).format()
    }, {
      where: {
        id: paramID
      }
    });
    const results = await db.findAll();
    res.render('dataDDL/position', {
      title: 'Position Management',
      positions: results,
      user: req.session.user
    })
  } catch (err) {
    console.error('Error put data :', err);
    res.status(500).json({ error: 'Put update positions invalid.' })
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
    res.render('dataDDL/position', {
      title: 'Position Management',
      positions: results,
      user: req.session.user
    })
  } catch (err) {
    console.error('Error get remove data :', err)
    res.status(500).json({ error: 'Get remove positions invalid.' })
  }
}

exports.getView = async (req, res) => {
  try {
    const result = await db.findOne({ where: { id: [req.params.id] } });
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
    res.render('dataDDL/positionView', {
      title: 'Position View',
      position: result,
      coverDate: coverDate,
      user: req.session.user
    })
  } catch (err) {
    console.error('Error get data:', err)
    res.status(500).json({ error: 'Get view positions invalid.' })
  }
}




