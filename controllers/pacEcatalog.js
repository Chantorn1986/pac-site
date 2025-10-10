const db = require("../db/db.js");
const { v4: uuidv4 } = require("uuid");
const moment = require('moment');

const dbEproduct = require('../models/eCatalog/eCatalogProducts');
const dbEtypeProduct = require('../models/eCatalog/eCatalogBTypeProducts');
const dbEbrand = require('../models/eCatalog/eCatalogBrands');
// const PrismaClient= require('/node_modules/@prisma/client');

// const prisma = new PrismaClient();



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
    console.log(results)
    res.render('pacEcatalog/adminEcatalog/indexAdmin', {
      title: 'Admin Catalog'
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
      brandJson: JSON.stringify(results)
    })
  } catch (err) {
    console.error('Error list data :', err)
    res.status(500).json({ error: 'List brands invalid.' })
  }
}

exports.getCreateBrands = async (req, res) => {
  try {
    let maxNo = await dbEbrand.max('no');
    if (maxNo === undefined || maxNo === null) {
      maxNo = 0
    }
    res.render('pacEcatalog/adminEcatalog/adEcatalogBrandsAdd', {
      title: 'Brands Create',
      maxNo: maxNo + 1,
      updatedAt: moment(new Date()).format('DD/MM/YYYY HH:mm:ss')
    })
  } catch (err) {
    console.error('Error get data :', err)
    res.status(500).json({ error: 'Get create brands invalid.' })
  }
}

exports.postCreateBrands = async (req, res) => {
  try {
    const { brandsNo, brandsCode, brandsCreatedAt, brandsNameTH, brandsNameEN, shortKeyword, keyword, linkMain, brandsYear } = req.body;
    const image = req.file ? req.file.filename : null;
    const newResults = await dbEbrand.create({
      id: uuidv4(),
      no: brandsNo,
      code: brandsCode,
      createdAt: brandsCreatedAt,
      nameTH: brandsNameTH,
      nameEN: brandsNameEN,
      shortKeyword: shortKeyword,
      keyword: keyword,
      linkMain: linkMain,
      year: brandsYear,
      img: image
    })

    const results = await dbEbrand.findAll();
    res.render('pacEcatalog/adminEcatalog/adEcatalogBrands', {
      title: 'Brands Management',
      brands: results,
      brandJson: JSON.stringify(results)
    })
  } catch (err) {
    console.error('Error post data :', err)
    res.status(500).json({ error: 'Post create brands invalid.' })
  }
}

exports.getUpdateBrands = async (req, res) => {
  try {
    const result = await dbEbrand.findOne({ where: { id: req.params.id } });
    const coverDate = {
      createdAt: null,
      updatedAt: null,
      year: null,
      timestamp: moment(new Date()).format('DD/MM/YYYY HH:mm:ss'),
    }
    if (result.createdAt !== undefined || result.createdAt !== null) {
      coverDate.createdAt = moment(result.createdAt).format('DD/MM/YYYY HH:mm:ss');
    }
    if (result.updatedAt !== undefined || result.updatedAt !== null) {
      coverDate.updatedAt = moment(result.updatedAt).format('DD/MM/YYYY HH:mm:ss');
    }
    if (result.year !== undefined || result.year !== null) {
      coverDate.year = moment(result.year).format('YYYY-MM-DD');
    }

    res.render('pacEcatalog/adminEcatalog/adEcatalogBrandsEdit', {
      title: 'Brands Edit',
      brands: result,
      coverDate: coverDate
    })
  } catch (err) {
    console.error('Error get data :', err)
    res.status(500).json({ error: 'Get update brands invalid.' })
  }
}

exports.putUpdateBrands = async (req, res) => {
  try {
    const { brandsNoE, brandsCodeE, brandsNameTHE, brandsNameENE, shortKeywordE, keywordE, linkMainE, brandsYearE } = req.body;
    const image = req.file ? req.file.filename : null;
    if (image === undefined || image === null) {
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
        img: image,
        updatedAt: moment(new Date()).format()
      }, {
        where: {
          id: req.params.id
        }
      });
    }
    console.log(image);
    const results = await dbEbrand.findAll();
    res.render('pacEcatalog/adminEcatalog/adEcatalogBrands', {
      title: 'Brands Management',
      brands: results,
      brandJson: JSON.stringify(results)
    })
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
      brandJson: JSON.stringify(results)
    })
  } catch (err) {
    console.error('Error get remove data :', err)
    res.status(500).json({ error: 'Get remove brands invalid.' })
  }
}

exports.listTypeProducts = async (req, res) => {
  try {
    const results = await dbEtypeProduct.findAll();
    res.render('pacEcatalog/adminEcatalog/adEcatalogTypeProducts', {
      title: 'Type Products Management',
      typeProducts: results,
      typeProductJson: JSON.stringify(results)
    })
  } catch (err) {
    console.error('Error list data :', err)
    res.status(500).json({ error: 'List type products invalid.' })
  }
}

exports.getCreateTypeProducts = async (req, res) => {
  try {
    let maxNo = await dbEtypeProduct.max('no');
    if (maxNo === undefined || maxNo === null) {
      maxNo = 0
    }
    res.render('pacEcatalog/adminEcatalog/adEcatalogTypeProductsAdd', {
      title: 'Type Products Create',
      maxNo: maxNo + 1,
      updatedAt: moment(new Date()).format('DD/MM/YYYY HH:mm:ss'),
    })
  } catch (err) {
    console.error('Error get data :', err)
    res.status(500).json({ error: 'Get create type products invalid.' })
  }
}

exports.postCreateTypeProducts = async (req, res) => {
  try {
    const { typeProductsNo, typeProductsCode, typeProductsCreatedAt, typeProductsNameTH, typeProductsNameEN, shortKeyword, keyword } = req.body;
    const image = req.file ? req.file.filename : null;
    const newResults = await dbEtypeProduct.create({
      id: uuidv4(),
      no: typeProductsNo,
      code: typeProductsCode,
      createdAt: typeProductsCreatedAt,
      nameTH: typeProductsNameTH,
      nameEN: typeProductsNameEN,
      shortKeyword: shortKeyword,
      keyword: keyword,
      img: image
    })
    const results = await dbEtypeProduct.findAll();
    res.render('pacEcatalog/adminEcatalog/adEcatalogTypeProducts', {
      title: 'Type Products Management',
      typeProducts: results,
      typeProductJson: JSON.stringify(results)
    })
  } catch (err) {
    console.error('Error post data :', err)
    res.status(500).json({ error: 'Post create type products invalid.' })
  }
}

exports.getUpdateTypeProducts = async (req, res) => {
  try {
    const result = await dbEtypeProduct.findOne({ where: { id: req.params.id } });
    const coverDate = {
      createdAt: null,
      updatedAt: null,
      timestamp: moment(new Date()).format('DD/MM/YYYY HH:mm:ss'),
    }
    if (result.createdAt !== undefined || result.createdAt !== null) {
      coverDate.createdAt = moment(result.createdAt).format('DD/MM/YYYY HH:mm:ss');
    }
    if (result.updatedAt !== undefined || result.updatedAt !== null) {
      coverDate.updatedAt = moment(result.updatedAt).format('DD/MM/YYYY HH:mm:ss');
    }

    res.render('pacEcatalog/adminEcatalog/adEcatalogTypeProductsEdit', {
      title: 'Type Products Edit',
      typeProducts: result,
      coverDate: coverDate,
    })
  } catch (err) {
    console.error('Error get data :', err)
    res.status(500).json({ error: 'Get update type products invalid.' })
  }
}

exports.putUpdateTypeProducts = async (req, res) => {
  try {
    const { typeProductsNoE, typeProductsCodeE, typeProductsNameTHE, typeProductsNameENE, shortKeywordE, keywordE } = req.body;
    const image = req.file ? req.file.filename : null;
    if (image === undefined || image === null) {
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
    } else {
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
    }
    console.log(image);
    const results = await dbEtypeProduct.findAll();
    res.render('pacEcatalog/adminEcatalog/adEcatalogTypeProducts', {
      title: 'Type Products Management',
      typeProducts: results,
      typeProductJson: JSON.stringify(results)
    })
  } catch (err) {
    console.error('Error put data :', err);
    res.status(500).json({ error: 'Put update type products invalid.' })
  }
}

exports.getRemoveTypeProducts = async (req, res) => {
  try {
    await dbEtypeProduct.destroy({
      where: {
        id: req.params.id
      }
    });
    const results = await dbEtypeProduct.findAll();
    res.render('pacEcatalog/adminEcatalog/adEcatalogTypeProducts', {
      title: 'Type Products Management',
      typeProducts: results,
      typeProductJson: JSON.stringify(results)
    })
  } catch (err) {
    console.error('Error get remove data :', err)
    res.status(500).json({ error: 'Get remove type products invalid.' })
  }
}