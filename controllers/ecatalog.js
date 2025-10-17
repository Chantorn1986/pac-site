const db = require("../db/db.js");
const { v4: uuidv4 } = require("uuid");
const moment = require('moment');

const dbEproduct = require('../models/eCatalog/eCatalogProducts.js');
const dbEtypeProduct = require('../models/eCatalog/eCatalogBTypeProducts.js');
const dbEbrand = require('../models/eCatalog/eCatalogBrands.js');

exports.aboutUs = async (req, res) => {
  try {
    res.render('ecatalog/aboutUs', { title: 'About Us' })
  } catch (err) {
    console.error('Error list data :', err)
    res.status(500).json({ error: 'List departments invalid.' })
  }
}

exports.vision = async (req, res) => {
  try {
    res.render('ecatalog/vision', { title: 'Vision' })
  } catch (err) {
    console.error('Error list data :', err)
    res.status(500).json({ error: 'List departments invalid.' })
  }
}

exports.mission = async (req, res) => {
  try {
    res.render('ecatalog/mission', { title: 'Mission'})
  } catch (err) {
    console.error('Error list data :', err)
    res.status(500).json({ error: 'List departments invalid.' })
  }
}

exports.certificate = async (req, res) => {
  try {
    res.render('ecatalog/certificate', { title: 'Certificate' })
  } catch (err) {
    console.error('Error list data :', err)
    res.status(500).json({ error: 'List departments invalid.' })
  }
}

exports.contact = async (req, res) => {
  try {
    res.render('ecatalog/contact', { title: 'Contact' })
  } catch (err) {
    console.error('Error list data :', err)
    res.status(500).json({ error: 'List departments invalid.' })
  }
}

exports.partner = async (req, res) => {
  try {
    res.render('ecatalog/partner', { title: 'Partner' })
  } catch (err) {
    console.error('Error list data :', err)
    res.status(500).json({ error: 'List departments invalid.' })
  }
}

exports.timeline = async (req, res) => {
  try {
    res.render('ecatalog/timeline', { title: 'Timeline' })
  } catch (err) {
    console.error('Error list data :', err)
    res.status(500).json({ error: 'List departments invalid.' })
  }
}

exports.indexAdmin = async (req, res) => {
  try {
    res.render('ecatalog/admin/indexAdmin', { title: 'Admin Catalog' })
  } catch (err) {
    console.error('Error list data :', err)
    res.status(500).json({ error: 'List departments invalid.' })
  }
}

exports.getBrands = async (req, res) => {
  try {
    const results = await dbEbrand.findAll();
    res.render('ecatalog/admin/brands', {
      title: 'Brands Management',
      brands: results,
      brandJson: JSON.stringify(results)
    })
  } catch (err) {
    console.error('Error list data :', err)
    res.status(500).json({ error: 'List brands invalid.' })
  }
}

exports.getAddBrands = async (req, res) => {
  try {
    let maxNo = await dbEbrand.max('no');
    if (maxNo === undefined || maxNo === null) {
      maxNo = 0
    }
    res.render('ecatalog/admin/brandsAdd', {
      title: 'Brands Create',
      maxNo: maxNo + 1,
      updatedAt: moment(new Date()).format('DD/MM/YYYY HH:mm:ss'),
      year: moment(new Date()).format('YYYY')
    })
  } catch (err) {
    console.error('Error get data :', err)
    res.status(500).json({ error: 'Get create brands invalid.' })
  }
}

exports.postAddBrands = async (req, res) => {
  try {
    const { brandsNo, brandsCode, brandsCreatedAt, brandsNameTH, brandsNameEN, shortKeyword, keyword, linkMain, brandsYear } = req.body;
    const image = req.file ? req.file.filename : null;
    if (image) {
      await dbEbrand.create({
        id: uuidv4(),
        no: brandsNo,
        code: brandsCode,
        nameTH: brandsNameTH,
        nameEN: brandsNameEN,
        shortKeyword: shortKeyword,
        keyword: keyword,
        linkMain: linkMain,
        year: brandsYear,
        img: image
      })
    } else {
      await dbEbrand.create({
        id: uuidv4(),
        no: brandsNo,
        code: brandsCode,
        nameTH: brandsNameTH,
        nameEN: brandsNameEN,
        shortKeyword: shortKeyword,
        keyword: keyword,
        linkMain: linkMain,
        year: brandsYear,
      })
    }

    const results = await dbEbrand.findAll();
    res.render('ecatalog/admin/brands', {
      title: 'Brands Management',
      brands: results,
      brandJson: JSON.stringify(results)
    })
  } catch (err) {
    console.error('Error post data :', err)
    res.status(500).json({ error: 'Post create brands invalid.' })
  }
}

exports.getEditBrands = async (req, res) => {
  try {
    const result = await dbEbrand.findOne({ where: { id: req.params.id } });
    const coverDate = {
      createdAt: result.createdAt ? moment(result.createdAt).format('DD/MM/YYYY HH:mm:ss') : undefined,
      updatedAt: result.updatedAt ? moment(result.updatedAt).format('DD/MM/YYYY HH:mm:ss') : undefined,
      timestamp: moment(new Date()).format('DD/MM/YYYY HH:mm:ss'),
    }
    res.render('ecatalog/admin/brandsEdit', {
      title: 'Brands Edit',
      brands: result,
      coverDate: coverDate
    })
  } catch (err) {
    console.error('Error get data :', err)
    res.status(500).json({ error: 'Get update brands invalid.' })
  }
}

exports.postEditBrands = async (req, res) => {
  try {
    const { brandsNoE, brandsCodeE, brandsNameTHE, brandsNameENE, shortKeywordE, keywordE, linkMainE, brandsYearE } = req.body;
    const image = req.file ? req.file.filename : null;
    if (image) {
      await dbEbrand.update({
        no: brandsNoE,
        code: brandsCodeE,
        nameTH: brandsNameTHE,
        nameEN: brandsNameENE,
        shortKeyword: shortKeywordE,
        keyword: keywordE,
        linkMain: linkMainE,
        year: brandsYearE,
        img: image,
        updatedAt: moment(new Date()).format()
      }, {
        where: {
          id: req.params.id
        }
      });
    } else {
      await dbEbrand.update({
        no: brandsNoE,
        code: brandsCodeE,
        nameTH: brandsNameTHE,
        nameEN: brandsNameENE,
        shortKeyword: shortKeywordE,
        keyword: keywordE,
        linkMain: linkMainE,
        year: brandsYearE,
        updatedAt: moment(new Date()).format()
      }, {
        where: {
          id: req.params.id
        }
      });
    }
    console.log(image);
    const results = await dbEbrand.findAll();
    res.render('ecatalog/admin/brands', {
      title: 'Brands Management',
      brands: results,
      brandJson: JSON.stringify(results)
    })
  } catch (err) {
    console.error('Error put data :', err);
    res.status(500).json({ error: 'Put update brands invalid.' })
  }
}

exports.delBrands = async (req, res) => {
  try {
    await dbEbrand.destroy({
      where: {
        id: req.params.id
      }
    });
    const results = await dbEbrand.findAll();
    res.render('ecatalog/admin/brands', {
      title: 'Brands Management',
      brands: results,
      brandJson: JSON.stringify(results)
    })
  } catch (err) {
    console.error('Error get remove data :', err)
    res.status(500).json({ error: 'Get remove brands invalid.' })
  }
}

exports.getTypeProducts = async (req, res) => {
  try {
    const results = await dbEtypeProduct.findAll();
    res.render('ecatalog/admin/typeProducts', {
      title: 'Type Products Management',
      typeProducts: results,
      typeProductJson: JSON.stringify(results)
    })
  } catch (err) {
    console.error('Error list data :', err)
    res.status(500).json({ error: 'List type products invalid.' })
  }
}

exports.getAddTypeProducts = async (req, res) => {
  try {
    let maxNo = await dbEtypeProduct.max('no');
    if (maxNo === undefined || maxNo === null) {
      maxNo = 0
    }
    res.render('ecatalog/admin/typeProductsAdd', {
      title: 'Type Products Create',
      maxNo: maxNo + 1,
      updatedAt: moment(new Date()).format('DD/MM/YYYY HH:mm:ss'),
    })
  } catch (err) {
    console.error('Error get data :', err)
    res.status(500).json({ error: 'Get create type products invalid.' })
  }
}

exports.postAddTypeProducts = async (req, res) => {
  try {
    const { typeProductsNo, typeProductsCode, typeProductsCreatedAt, typeProductsNameTH, typeProductsNameEN, shortKeyword, keyword } = req.body;
    const image = req.file ? req.file.filename : null;
    if (image) {
      await dbEtypeProduct.create({
        id: uuidv4(),
        no: typeProductsNo,
        code: typeProductsCode,
        nameTH: typeProductsNameTH,
        nameEN: typeProductsNameEN,
        shortKeyword: shortKeyword,
        keyword: keyword,
        img: image
      })
    } else {
      await dbEtypeProduct.create({
        id: uuidv4(),
        no: typeProductsNo,
        code: typeProductsCode,
        nameTH: typeProductsNameTH,
        nameEN: typeProductsNameEN,
        shortKeyword: shortKeyword,
        keyword: keyword
      })
    }
    const results = await dbEtypeProduct.findAll();
    res.render('ecatalog/admin/typeProducts', {
      title: 'Type Products Management',
      typeProducts: results,
      typeProductJson: JSON.stringify(results)
    })
  } catch (err) {
    console.error('Error post data :', err)
    res.status(500).json({ error: 'Post create type products invalid.' })
  }
}

exports.getEditTypeProducts = async (req, res) => {
  try {
    const result = await dbEtypeProduct.findOne({ where: { id: req.params.id } });
    const coverDate = {
      createdAt: result.createdAt ? moment(result.createdAt).format('DD/MM/YYYY HH:mm:ss') : undefined,
      updatedAt: result.updatedAt ? moment(result.updatedAt).format('DD/MM/YYYY HH:mm:ss') : undefined,
      timestamp: moment(new Date()).format('DD/MM/YYYY HH:mm:ss'),
    }
    res.render('ecatalog/admin/typeProductsEdit', {
      title: 'Type Products Edit',
      typeProducts: result,
      coverDate: coverDate,
    })
  } catch (err) {
    console.error('Error get data :', err)
    res.status(500).json({ error: 'Get update type products invalid.' })
  }
}

exports.postEditTypeProducts = async (req, res) => {
  try {
    const { typeProductsNoE, typeProductsCodeE, typeProductsNameTHE, typeProductsNameENE, shortKeywordE, keywordE } = req.body;
    const image = req.file ? req.file.filename : null;
    if (image) {
      await dbEtypeProduct.update({
        no: typeProductsNoE,
        code: typeProductsCodeE,
        nameTH: typeProductsNameTHE,
        nameEN: typeProductsNameENE,
        shortKeyword: shortKeywordE,
        keyword: keywordE,
        img: image,
        updatedAt: moment(new Date()).format()
      }, {
        where: {
          id: req.params.id
        }
      });
    } else {
      await dbEtypeProduct.update({
        no: typeProductsNoE,
        code: typeProductsCodeE,
        nameTH: typeProductsNameTHE,
        nameEN: typeProductsNameENE,
        shortKeyword: shortKeywordE,
        keyword: keywordE,
        updatedAt: moment(new Date()).format()
      }, {
        where: {
          id: req.params.id
        }
      });
    }
    console.log(image);
    const results = await dbEtypeProduct.findAll();
    res.render('ecatalog/admin/typeProducts', {
      title: 'Type Products Management',
      typeProducts: results,
      typeProductJson: JSON.stringify(results)
    })
  } catch (err) {
    console.error('Error put data :', err);
    res.status(500).json({ error: 'Put update type products invalid.' })
  }
}

exports.delTypeProducts = async (req, res) => {
  try {
    await dbEtypeProduct.destroy({
      where: {
        id: req.params.id
      }
    });
    const results = await dbEtypeProduct.findAll();
    res.render('ecatalog/admin/typeProducts', {
      title: 'Type Products Management',
      typeProducts: results,
      typeProductJson: JSON.stringify(results)
    })
  } catch (err) {
    console.error('Error get remove data :', err)
    res.status(500).json({ error: 'Get remove type products invalid.' })
  }
}