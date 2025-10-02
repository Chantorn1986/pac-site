const db = require("../db/db.js");
const { v4: uuidv4 } = require("uuid");
const moment = require('moment');

const dbEproduct = require('../models/eCatalog/eCatalogProducts');
const dbEtypeProduct = require('../models/eCatalog/eCatalogBTypeProducts');
const dbEbrand = require('../models/eCatalog/eCatalogBrands');

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

exports.indexAdmin = async (req, res) => {
  try {
    // const results = await db.findAll();
    res.render('pacEcatalog/adminEcatalog/indexAdmin', {
      title: 'Admin Catalog',
      // departments: results,
      // user: req.session.user
    })
  } catch (err) {
    console.error('Error list data :', err)
    res.status(500).json({ error: 'List departments invalid.' })
  }
}

exports.listBrands = async (req, res) => {
  try {
    const results = await dbEbrand.findAll();
    res.render('pacEcatalog/adminEcatalog/adEcatalogBrands', {
      title: 'Brands Management',
      brands: results,
      // user: req.session.user
    })
  } catch (err) {
    console.error('Error list data :', err)
    res.status(500).json({ error: 'List brands invalid.' })
  }
}

exports.getCreateBrands = async (req, res) => {
  try {
    let maxNo = await dbEbrand.max('no');
    if(maxNo === undefined || maxNo === null) {
      maxNo = 0
    }
    res.render('pacEcatalog/adminEcatalog/adEcatalogBrandsAdd', {
      title: 'Brands Create',
      maxNo: maxNo+1,
      updatedAt: moment(new Date()).format('DD/MM/YYYY HH:mm:ss'),
      // user: req.session.user
    })
  } catch (err){
    console.error('Error get data :', err)
    res.status(500).json({ error: 'Get create brands invalid.' })
  }
}

exports.postCreateBrands = async (req, res) => {
  try {
    const { brandsNo, brandsCode, brandsCreatedAt,brandsNameTH,brandsNameEN,shortKeyword,keyword,linkMain,brandsYear,imgBrand } = req.body;
    // upload.single('imgBrand')
    const image = req.file ? req.file.filename : null;
    console.log('Image file:', req.file);
    console.log('Image filename:', image);
    // const newResults = await dbEbrand.create({
    //   id: uuidv4(),
    //   no: brandsNo,
    //   code: brandsCode,
    //   createdAt: brandsCreatedAt,
    //   nameTH: brandsNameTH,
    //   nameEN: brandsNameEN,
    //   shortKeyword: shortKeyword,
    //   keyword: keyword,
    //   linkMain: linkMain,
    //   year: brandsYear,
    //   img: image
    // })

    const results = await dbEbrand.findAll();
    res.render('pacEcatalog/adminEcatalog/adEcatalogBrands', {
      title: 'Brands Management',
      brands: results,
      // user: req.session.user
    })
  } catch (err) {
    console.error('Error post data :', err)
    res.status(500).json({ error: 'Post create brands invalid.' })
  }
}

exports.getUpdateBrands = async (req, res) => {
  try {

  } catch (err) {
    console.error('Error get data :', err)
    res.status(500).json({ error: 'Get update brands invalid.' })
  }
}

exports.putUpdateBrands = async (req, res) => {
  try {

  } catch (err) {
    console.error('Error put data :', err);
    res.status(500).json({ error: 'Put update brands invalid.' })
  }
}

exports.getRemoveBrands = async (req, res) => {
  try {
    await dbEbrand.destroy({
      where: {
        id: req.params.id
      }
    });
    const results = await dbEbrand.findAll();
    res.render('pacEcatalog/adminEcatalog/adEcatalogBrands', {
      title: 'Brands Management',
      brands: results,
      // user: req.session.user
    })
  } catch (err) {
    console.error('Error get remove data :', err)
    res.status(500).json({ error: 'Get remove brands invalid.' })
  }
}

exports.getViewBrands = async (req, res) => {
  try {

  } catch (err) {
    console.error('Error get data:', err)
    res.status(500).json({ error: 'Get view brands invalid.' })
  }
}