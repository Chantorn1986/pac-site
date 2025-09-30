const { v4: uuidv4 } = require("uuid");
const moment = require('moment');

exports.aboutUs = async (req, res) => {
  try {
    // const results = await db.findAll();
    res.render('pacEcatalog/aboutUs', {
      title: 'About Us',
      // departments: results,
      // user: req.session.user
    })
  } catch (err) {
    console.error('Error list data :', err)
    res.status(500).json({ error: 'List departments invalid.' })
  }
}

exports.vision = async (req, res) => {
  try {
    // const results = await db.findAll();
    res.render('pacEcatalog/vision', {
      title: 'Vision',
      // departments: results,
      // user: req.session.user
    })
  } catch (err) {
    console.error('Error list data :', err)
    res.status(500).json({ error: 'List departments invalid.' })
  }
}

exports.mission = async (req, res) => {
  try {
    // const results = await db.findAll();
    res.render('pacEcatalog/mission', {
      title: 'Mission',
      // departments: results,
      // user: req.session.user
    })
  } catch (err) {
    console.error('Error list data :', err)
    res.status(500).json({ error: 'List departments invalid.' })
  }
}

exports.certificate = async (req, res) => {
  try {
    // const results = await db.findAll();
    res.render('pacEcatalog/certificate', {
      title: 'Certificate',
      // departments: results,
      // user: req.session.user
    })
  } catch (err) {
    console.error('Error list data :', err)
    res.status(500).json({ error: 'List departments invalid.' })
  }
}

exports.contact = async (req, res) => {
  try {
    // const results = await db.findAll();
    res.render('pacEcatalog/contact', {
      title: 'Contact',
      // departments: results,
      // user: req.session.user
    })
  } catch (err) {
    console.error('Error list data :', err)
    res.status(500).json({ error: 'List departments invalid.' })
  }
}

exports.partner = async (req, res) => {
  try {
    // const results = await db.findAll();
    res.render('pacEcatalog/partner', {
      title: 'Partner',
      // departments: results,
      // user: req.session.user
    })
  } catch (err) {
    console.error('Error list data :', err)
    res.status(500).json({ error: 'List departments invalid.' })
  }
}

exports.timeline = async (req, res) => {
  try {
    // const results = await db.findAll();
    res.render('pacEcatalog/timeline', {
      title: 'Timeline',
      // departments: results,
      // user: req.session.user
    })
  } catch (err) {
    console.error('Error list data :', err)
    res.status(500).json({ error: 'List departments invalid.' })
  }
}