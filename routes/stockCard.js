const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const path = require('path');
const { v4: uuidv4 } = require("uuid");
router.use(express.urlencoded({ extended: true }));
const db = require("../db/db.js");
const moment = require('moment');
const {isAuthenticated} = require('../middlewares/authCheck')

router.get('/', isAuthenticated, (req, res) => {
  const sql2t = "SELECT * FROM `view_stockCard_goodsBrandsStatus` ORDER BY cardDate DESC;";
  try {
    db.query(sql2t, (err, results) => {
      if (err) throw err;

      res.render('stockCard/stockCard', {
        title: 'Stock Card Management',
        stockCard: results,
        user: req.session.user

      })

    })
  } catch (err) {
    console.error('Error view data:', err);
    res.status(500).json({ error: 'Error view data into the database.' });
  }
});
router.get('/Add', isAuthenticated, (req, res) => {
  const sql1 = "SELECT id,keyword FROM stockCardGoods ORDER BY keyword ASC";
  const sql2 = "SELECT id,nameEN FROM stockCardStatus ORDER BY no ASC";
  const now = new Date();
  const dateString = moment(now).format('YYYY-MM-DD');
  try {
    db.query(sql1, (err, results1) => {
      if (err) throw err;

      db.query(sql2, (err, results2) => {
        if (err) throw err;

        res.render('stockCard/stockCardAdd', {
          title: 'Stock Card Create',
          stockCardGoods: results1,
          stockCardStatus: results2,
          dateDefault: dateString,
          user: req.session.user
        });
      })
    })
  } catch (err) {
    console.error('Error view data:', err);
    res.status(500).json({ error: 'Error view data into the database.' }); stockCardStatus
  }
})

router.get('/Add/:id', isAuthenticated, (req, res) => {
  const sql1 = "SELECT id,keyword FROM stockCardGoods WHERE id = ?";
  const sql2 = "SELECT id,nameEN FROM stockCardStatus ORDER BY no ASC";
  const now = new Date();
  const dateString = moment(now).format('YYYY-MM-DD');
  try {
    db.query(sql1, [req.params.id], (err, results1) => {
      if (err) throw err;

      db.query(sql2, (err, results2) => {
        if (err) throw err;

        res.render('stockCard/stockCardAdd', {
          title: 'Stock Card Create',
          stockCardGoods: results1,
          stockCardStatus: results2,
          dateDefault: dateString,
          user: req.session.user
        });
      })
    })
  } catch (err) {
    console.error('Error view data:', err);
    res.status(500).json({ error: 'Error view data into the database.' }); stockCardStatus
  }
})

router.post('/Add', isAuthenticated, (req, res) => {
  const { stockCardGoodsID, stockCardDate, stockCardDocument, stockCardStatusID, stockCardQty, stockCardNote, stockCardSecFull, stockCardRetrun } = req.body;
  const uuid = uuidv4();
  const sqlAdd = "INSERT INTO `stockCard`(`id`, `goodsID`, `date`, `document`, `statusID`,`qty`, `note` ,`sectionFull`,`qtyRe`) VALUES (?,?,?,?,?,?,?,?,?)";
  try {
    db.query(sqlAdd, [uuid, stockCardGoodsID, stockCardDate, stockCardDocument, stockCardStatusID, stockCardQty, stockCardNote, stockCardSecFull, stockCardRetrun], (err, result) => {
      if (err) throw err;

      const sql2t = "SELECT * FROM `view_stockCard_goodsBrandsStatus` ORDER BY cardDate DESC;";
      db.query(sql2t, (err, results) => {
        if (err) throw err;

        /*res.render('stockCard/stockCard', { 
            title: 'Stock Card Management',
            stockCard : results,
            user: req.session.user
        });*/
        res.redirect('/stockCard/AddCard/' + stockCardGoodsID);
      })
    })
  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).json({ error: 'Error inserting data into the database.' });
  }
})

router.get('/Edit/:id', isAuthenticated, (req, res) => {
  const sql1 = "SELECT id,keyword FROM stockCardGoods ORDER BY keyword ASC";
  const sql2 = "SELECT id,nameEN FROM stockCardStatus ORDER BY no ASC";
  const sql2t = "SELECT * FROM `view_stockCard_goodsBrandsStatus` WHERE id = ? ;"
  try {
    db.query(sql1, (err, results1) => {
      if (err) throw err;

      db.query(sql2, (err, results2) => {
        if (err) throw err;

        db.query(sql2t, [req.params.id], (err, result) => {
          if (err) throw err;
          const dateString = moment(result[0].dateOld).format('YYYY-MM-DD');
          res.render('stockCard/stockCardEdit', {
            title: 'Stock Card Edit',
            stockCard: result[0],
            stockCardGoods: results1,
            stockCardStatus: results2,
            dateString: dateString,
            user: req.session.user
          });
        });
      })
    })

  } catch (err) {
    console.error('Error view data:', err);
    res.status(500).json({ error: 'Error view data into the database.' });
  }
})

router.post('/Edit/:id', isAuthenticated, (req, res) => {
  try {
    const { stockCardGoodsIDE, stockCardDateE, stockCardDocumentE, stockCardStatusIDE, stockCardQtyE, stockCardNoteE, stockCardSecFullE, stockCardRetrunE } = req.body;
    const sql = "UPDATE stockCard SET goodsID=?,date=?,document=?,statusID=?,qty=?,note=?,updatedAt=? ,sectionFull=?,qtyRe=? WHERE id = ?";
    const today = new Date();
    const timestamp = moment(today).format();

    db.query(sql, [stockCardGoodsIDE, stockCardDateE, stockCardDocumentE, stockCardStatusIDE, stockCardQtyE, stockCardNoteE, timestamp, stockCardSecFullE, stockCardRetrunE, req.params.id], (err, result) => {
      if (err) throw err;
      res.redirect('/stockCard/AddCard/' + stockCardGoodsIDE);

    })
  } catch (err) {
    console.error('Error editing data:', err);
    res.status(500).json({ error: 'Error editing data into the database.' });
  }
})

router.get('/Del/:id', isAuthenticated, (req, res) => {
  try {
    const sql2t = "SELECT * FROM `view_stockCard_goodsBrandsStatus` WHERE id = ? ;"

    db.query(sql2t, [req.params.id], (err, result) => {
      if (err) throw err;

      const sql = "DELETE FROM stockCard WHERE id = ?";
      db.query(sql, [req.params.id], (err, result2) => {
        if (err) throw err;


        res.redirect('/stockCard/AddCard/' + result[0]['goodsID']);

      })

    });

  } catch (err) {
    console.error('Error deleting data:', err);
    res.status(500).json({ error: 'Error deleting data into the database.' });
  }
})

router.get('/View/:id', isAuthenticated, (req, res) => {
  try {
    const sql2t = "SELECT * FROM `view_stockCard_goodsBrandsStatus` WHERE id = ? ;"

    db.query(sql2t, [req.params.id], (err, result) => {
      if (err) throw err;

      res.render('stockCard/stockCardView', {
        title: 'Stock Card View',
        stockCard: result[0],
        user: req.session.user
      });
    });
  } catch (err) {
    console.error('Error view data:', err);
    res.status(500).json({ error: 'Error view data into the database.' });
  }
})

router.get('/Report', (req, res) => {
  const sqlBarBrand = "SELECT `name`,`id`, `code`, LEFT(`name`,1) as `title` FROM `stockCardBrands` ORDER BY name asc;";
  const sql2t = "SELECT * FROM `viewRpt_stockCard` ORDER BY code ASC;";
  try {
    db.query(sql2t, (err, results) => {
      if (err) throw err;
      db.query(sqlBarBrand, (err, barBrand) => {
        if (err) throw err;
        res.render('stockCard/stockCardReport', {
          title: 'Stock Card Management',
          stockCard: results,
          barBrand: barBrand,
          user: req.session.user
        });
      })
    })
  } catch (err) {
    console.error('Error view data:', err);
    res.status(500).json({ error: 'Error view data into the database.' });
  }
});

router.get('/Report/:id', (req, res) => {
  const sqlBarBrand = "SELECT `id`, `code`, `name`,LEFT(`name`,1) as `title` FROM `stockCardBrands`;";
  const sql2t = "SELECT * FROM `viewRpt_stockCard` WHERE brandID = ?;";
  try {
    db.query(sql2t, [req.params.id], (err, results) => {
      if (err) throw err;
      db.query(sqlBarBrand, (err, barBrand) => {
        if (err) throw err;
        res.render('stockCard/stockCardReport', {
          title: 'Stock Card Management',
          stockCard: results,
          barBrand: barBrand,
          user: req.session.user
        });
      })
    })
  } catch (err) {
    console.error('Error view data:', err);
    res.status(500).json({ error: 'Error view data into the database.' });
  }
});

router.get('/ReportBackEnd', isAuthenticated, (req, res) => {
  try {
    const sql2t = "SELECT * FROM `viewRpt_stockCard` ORDER BY code ASC;";

    db.query(sql2t, (err, results) => {
      if (err) throw err;

      res.render('stockCard/stockCardReportBackEnd', {
        title: 'Stock Card Management',
        stockCard: results,
        user: req.session.user
      });
    })
  } catch (err) {
    console.error('Error view data:', err);
    res.status(500).json({ error: 'Error view data into the database.' });
  }
});

router.get('/AddCard/:id', isAuthenticated, (req, res) => {
  const paramsID = req.params.id;
  const sql1 = "SELECT * FROM view_goods_brands WHERE id = ? ;";
  const sql2 = "SELECT id,name FROM stockCardBrands ORDER BY name ASC";
  const sql3 = "SELECT * FROM view_stockCard_goodsBrandsStatus WHERE goodsID = ?;";
  const sqlSum = "SELECT * FROM `viewRpt_stockCard` WHERE `id` = ?";
  try {
    db.query(sql1, [paramsID], (err, result) => {
      if (err) throw err;

      db.query(sql2, (err, stockCardBrands) => {
        if (err) throw err;

        db.query(sql3, [paramsID], (err, results) => {
          if (err) throw err;

          db.query(sqlSum, [paramsID], (err, resultsSum) => {
            if (err) throw err;
            res.render('stockCard/stockCardAddGoods', {
              title: 'Stock Card Management',
              stockCard: results,
              stockCardGoods: result[0],
              stockCardBrands: stockCardBrands,
              resultsSum: resultsSum[0],
              user: req.session.user
            });
          })

        })
      });
    });
  } catch (err) {
    console.error('Error view data:', err);
    res.status(500).json({ error: 'Error view data into the database.' });
  }
})

router.get('/brand', isAuthenticated, (req, res) => {
  try {
    const sql = "SELECT id,no,code,name,DATE_FORMAT(createdAt, '%d/%m/%Y %H:%i:%s') as createdAt,DATE_FORMAT(updatedAt, '%d/%m/%Y %H:%i:%s') as updatedAt FROM stockCardBrands ORDER BY no,code ASC";
    db.query(sql, (err, results) => {
      if (err) throw err;

      res.render('stockCard/stockCardBrands', {
        title: 'Stock Card Brands Management',
        stockCardBrands: results,
        user: req.session.user
      });
    })
  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).json({ error: 'Error inserting data into the database.' });
  }
});


router.get('/brand/Add', isAuthenticated, (req, res) => {
  res.render('stockCard/stockCardBrandsAdd', {
    title: 'Stock Card Brands Create',
    user: req.session.user
  });
})

router.post('/brand/Add', isAuthenticated, (req, res) => {
  const { stockCardBrandsNo, stockCardBrandsCode, stockCardBrandsName } = req.body;
  const uuid = uuidv4();
  const sql = "INSERT INTO stockCardBrands ( id, no,code, name ) VALUES(?, ?, ?,?)";
  db.query(sql, [uuid, stockCardBrandsNo, stockCardBrandsCode, stockCardBrandsName], (err, result) => {
    if (err) throw err;
    const sql = "SELECT id,no,code,name,DATE_FORMAT(createdAt, '%d/%m/%Y %H:%i:%s') as createdAt,DATE_FORMAT(updatedAt, '%d/%m/%Y %H:%i:%s') as updatedAt FROM stockCardBrands ORDER BY no,code ASC";

    db.query(sql, (err, results) => {
      if (err) throw err;

      res.render('stockCard/stockCardBrands', {
        title: 'Stock Card Brands Management',
        stockCardBrands: results,
        user: req.session.user
      });
    })
  })
})

router.get('/brand/Edit/:id', isAuthenticated, (req, res) => {
  const sql = "SELECT * FROM stockCardBrands WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.render('stockCard/stockCardBrandsEdit', {
      title: 'Stock Card Brands Edit',
      stockCardBrands: result[0],
      user: req.session.user
    });
  });
})

router.post('/brand/Edit/:id', isAuthenticated, (req, res) => {
  const { stockCardBrandsNoE, stockCardBrandsCodeE, stockCardBrandsNameE } = req.body;
  const today = new Date();
  const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
  const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const dateTime = date + ' ' + time;
  const timestamp = dateTime;
  const sql = "UPDATE stockCardBrands SET no = ?, Code = ?, name = ?, updatedAt=?  WHERE id = ?";
  db.query(sql, [stockCardBrandsNoE, stockCardBrandsCodeE, stockCardBrandsNameE, timestamp, req.params.id], (err, result) => {
    if (err) throw err;
    const sql = "SELECT id,no,code,name,DATE_FORMAT(createdAt, '%d/%m/%Y %H:%i:%s') as createdAt,DATE_FORMAT(updatedAt, '%d/%m/%Y %H:%i:%s') as updatedAt FROM stockCardBrands ORDER BY no,code ASC";

    db.query(sql, (err, results) => {
      if (err) throw err;

      res.render('stockCard/stockCardBrands', {
        title: 'Stock Card Brands Management',
        stockCardBrands: results,
        user: req.session.user
      });
    })
  })
})

router.get('/brand/Del/:id', isAuthenticated, (req, res) => {
  const sql = "DELETE FROM stockCardBrands WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    const sql = "SELECT id,no,code,name,DATE_FORMAT(createdAt, '%d/%m/%Y %H:%i:%s') as createdAt,DATE_FORMAT(updatedAt, '%d/%m/%Y %H:%i:%s') as updatedAt FROM stockCardBrands ORDER BY no ASC";

    db.query(sql, (err, results) => {
      if (err) throw err;

      res.render('stockCard/stockCardBrands', {
        title: 'Stock Card Brands Management',
        stockCardBrands: results,
        user: req.session.user
      });
    })
  });
})

router.get('/brand/View/:id', isAuthenticated, (req, res) => {
  const sql = "SELECT id,no,code,name,DATE_FORMAT(createdAt, '%d/%m/%Y %H:%i:%s') as createdAt,DATE_FORMAT(updatedAt, '%d/%m/%Y %H:%i:%s') as updatedAt FROM stockCardBrands WHERE id = ? ";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) throw err;
    res.render('stockCard/stockCardBrandsView', {
      title: 'Stock Card Brands View',
      stockCardBrands: result[0],
      user: req.session.user
    });
  });
})

router.get('/good', (req, res) => {
  try {
    const sql2t = "SELECT * FROM view_goods_brands ;";

    db.query(sql2t, (err, results) => {
      if (err) throw err;

      res.render('stockCard/stockCardGoods', {
        title: 'Stock Card Goods Management',
        stockCardGoods: results,
        user: req.session.user
      });
    })
  } catch (err) {
    console.error('Error view data:', err);
    res.status(500).json({ error: 'Error view data into the database.' });
  }
});


router.get('/good/Add', (req, res) => {
  try {
    const sql = "SELECT id,name FROM stockCardBrands ORDER BY name ASC";
    db.query(sql, (err, results) => {
      if (err) throw err;

      res.render('stockCard/stockCardGoodsAdd', {
        title: 'Stock Card Goods Create',
        stockCardBrands: results,
        user: req.session.user
      });
    })
  } catch (err) {
    console.error('Error view data:', err);
    res.status(500).json({ error: 'Error view data into the database.' });
  }

})

router.post('/good/Add', (req, res) => {
  try {
    const { stockCardGoodsNo, stockCardGoodsBrand, stockCardGoodsCode, stockCardGoodsModel, stockCardGoodsKeyword, stockCardGoodsPrice, stockCardGoodsLimitPrice, stockCardGoodsShelf, stockCardGoodsRemarkPurchase, stockCardGoodsRemarkSale, stockCardGoodsRemain, stockCardGoodsLength } = req.body;
    const uuid = uuidv4();
    const sql = "INSERT INTO stockCardGoods ( id, no,brandID,code, model ,keyword,price , limitPrice ,shelf , remarkPurchase ,remarkSale , remain,length) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(sql, [uuid, stockCardGoodsNo, stockCardGoodsBrand, stockCardGoodsCode, stockCardGoodsModel, stockCardGoodsKeyword, stockCardGoodsPrice, stockCardGoodsLimitPrice, stockCardGoodsShelf, stockCardGoodsRemarkPurchase, stockCardGoodsRemarkSale, stockCardGoodsRemain, stockCardGoodsLength], (err, result) => {
      if (err) throw err;

      const sql2t = "SELECT * FROM `viewRpt_stockCard` ORDER BY code ASC;";

      db.query(sql2t, (err, results) => {
        if (err) throw err;

        res.render('stockCard/stockCardReportBackEnd', {
          title: 'Stock Card Management',
          stockCard: results,
          user: req.session.user
        });
      })
    })
  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).json({ error: 'Error inserting data into the database.' });
  }
})

router.get('/good/Edit/:id', (req, res) => {
  try {
    const sql2t = "SELECT * FROM view_goods_brands WHERE id = ? ;";
    db.query(sql2t, [req.params.id], (err, result) => {
      if (err) throw err;

      const sql2 = "SELECT id,name FROM stockCardBrands ORDER BY name ASC";
      db.query(sql2, (err, stockCardBrands) => {
        if (err) throw err;
        res.render('stockCard/stockCardGoodsEdit', {
          title: 'Stock Card Goods Edit',
          stockCardGoods: result[0],
          stockCardBrands: stockCardBrands,
          user: req.session.user
        });
      });
    });
  } catch (err) {
    console.error('Error view data:', err);
    res.status(500).json({ error: 'Error view data into the database.' });
  }
})

router.post('/good/Edit/:id', (req, res) => {
  try {
    const { stockCardGoodsNoE, stockCardGoodsCodeE, stockCardGoodsBrandE, stockCardGoodsModelE, stockCardGoodsKeywordE, stockCardGoodsPriceE, stockCardGoodsLimitPriceE, stockCardGoodsShelfE, stockCardGoodsRemarkPurchaseE, stockCardGoodsRemarkSaleE, stockCardGoodsRemainE, stockCardGoodsLengthE } = req.body;
    const today = new Date();
    const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const dateTime = date + ' ' + time;
    const timestamp = dateTime;
    const sql = "UPDATE stockCardGoods SET no = ?, Code = ?,brandID = ?, model = ?,keyword = ?, updatedAt=? ,price=? , limitPrice=? ,shelf=? , remarkPurchase=? ,remarkSale=? , remain=? ,length =?  WHERE id = ?";
    db.query(sql, [stockCardGoodsNoE, stockCardGoodsCodeE, stockCardGoodsBrandE, stockCardGoodsModelE, stockCardGoodsKeywordE, timestamp, stockCardGoodsPriceE, stockCardGoodsLimitPriceE, stockCardGoodsShelfE, stockCardGoodsRemarkPurchaseE, stockCardGoodsRemarkSaleE, stockCardGoodsRemainE, stockCardGoodsLengthE, req.params.id], (err, result) => {
      if (err) throw err;

      res.redirect('/stockCard/AddCard/' + req.params.id);
    })
  } catch (err) {
    console.error('Error editing data:', err);
    res.status(500).json({ error: 'Error editing data into the database.' });
  }
})

router.get('/good/Del/:id', (req, res) => {
  try {
    const sql = "DELETE FROM stockCardGoods WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
      if (err) throw err;
      /*const sql2t = "SELECT * FROM view_goods_brands ;";

      db.query(sql2t, (err, results) => {
          if (err) throw err;
  
          res.render('stockCard/stockCardGoods', { 
              title: 'Stock Card Goods Management',
              stockCardGoods : results,
              user: req.session.user
          });
      */
      const sql2t = "SELECT * FROM `viewRpt_stockCard` ORDER BY code ASC;";

      db.query(sql2t, (err, results) => {
        if (err) throw err;

        res.render('stockCard/stockCardReportBackEnd', {
          title: 'Stock Card Management',
          stockCard: results,
          user: req.session.user
        });
      })
    });
  } catch (err) {
    console.error('Error deleting data:', err);
    res.status(500).json({ error: 'Error deleting data into the database.' });
  }
})

router.get('/good/View/:id', (req, res) => {
  try {
    const sql2t = "SELECT * FROM view_goods_brands WHERE id = ? ;";
    db.query(sql2t, [req.params.id], (err, result) => {
      if (err) throw err;

      res.render('stockCard/stockCardGoodsView', {
        title: 'Stock Card Goods View',
        stockCardGoods: result[0],
        user: req.session.user
      });
    });
  } catch (err) {
    console.error('Error view data:', err);
    res.status(500).json({ error: 'Error view data into the database.' });
  }
})

router.get('/status', isAuthenticated, (req, res) => {
  try {
    const sql2t = "SELECT * FROM stockCardStatus ORDER BY no ASC;";

    db.query(sql2t, (err, results) => {
      if (err) throw err;

      res.render('stockCard/stockCardStatus', {
        title: 'Stock Card Status Management',
        stockCardStatus: results,
        user: req.session.user
      });
    })
  } catch (err) {
    console.error('Error view data:', err);
    res.status(500).json({ error: 'Error view data into the database.' });
  }
});


router.get('/status/Add', isAuthenticated, (req, res) => {
  /* try {
       const sql = "SELECT id,name FROM stockCardBrands ORDER BY name ASC";
       db.query(sql, (err, results) => {
           if (err) throw err;*/

  res.render('stockCard/stockCardStatusAdd', {
    title: 'Stock Card Status Create',
    user: req.session.user
  });
  /* })    stockCardBrands: results,
} catch (err) {
   console.error('Error view data:', err);
   res.status(500).json({ error: 'Error view data into the database.' }); stockCardStatus
} */

})

router.post('/status/Add', isAuthenticated, (req, res) => {
  try {
    const { stockCardStatusNo, stockCardStatusNameTH, stockCardStatusNameEN, stockCardStatusInOut } = req.body;
    const uuid = uuidv4();
    const sql = "INSERT INTO stockCardStatus ( id,no,nameTH,nameEN,ValueInOut) VALUES(?, ?, ?, ?, ?)";
    db.query(sql, [uuid, stockCardStatusNo, stockCardStatusNameTH, stockCardStatusNameEN, stockCardStatusInOut], (err, result) => {
      if (err) throw err;
      const sql2t = "SELECT * FROM stockCardStatus ORDER BY no ASC;";

      db.query(sql2t, (err, results) => {
        if (err) throw err;

        res.render('stockCard/stockCardStatus', {
          title: 'Stock Card Goods Management',
          stockCardStatus: results,
          user: req.session.user
        });
      })
    })
  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).json({ error: 'Error inserting data into the database.' });
  }
})

router.get('/status/Edit/:id', isAuthenticated, (req, res) => {
  try {
    const sql2t = "SELECT * FROM stockCardStatus WHERE id = ? ;"
    db.query(sql2t, [req.params.id], (err, result) => {
      if (err) throw err;

      res.render('stockCard/stockCardStatusEdit', {
        title: 'Stock Card Status Edit',
        stockCardStatus: result[0],
        user: req.session.user
      });
    });
  } catch (err) {
    console.error('Error view data:', err);
    res.status(500).json({ error: 'Error view data into the database.' });
  }
})

router.post('/status/Edit/:id', isAuthenticated, (req, res) => {
  try {
    const { stockCardStatusNoE, stockCardStatusNameTHE, stockCardStatusNameENE, stockCardStatusInOutE } = req.body;
    const sql = "UPDATE stockCardStatus SET no = ?, nameTH = ?,nameEN = ?, ValueInOut = ?  WHERE id = ?";
    db.query(sql, [stockCardStatusNoE, stockCardStatusNameTHE, stockCardStatusNameENE, stockCardStatusInOutE, req.params.id], (err, result) => {
      if (err) throw err;
      const sql2t = "SELECT * FROM stockCardStatus ORDER BY no ASC;";

      db.query(sql2t, (err, results) => {
        if (err) throw err;

        res.render('stockCard/stockCardStatus', {
          title: 'Stock Card Status Management',
          stockCardStatus: results,
          user: req.session.user
        });
      })
    })
  } catch (err) {
    console.error('Error editing data:', err);
    res.status(500).json({ error: 'Error editing data into the database.' });
  }
})

router.get('/status/Del/:id', isAuthenticated, (req, res) => {
  try {
    const sql = "DELETE FROM stockCardStatus WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
      if (err) throw err;
      const sql2t = "SELECT * FROM stockCardStatus ORDER BY no ASC;";

      db.query(sql2t, (err, results) => {
        if (err) throw err;

        res.render('stockCard/stockCardStatus', {
          title: 'Stock Card Status Management',
          stockCardStatus: results,
          user: req.session.user
        });
      })
    });
  } catch (err) {
    console.error('Error deleting data:', err);
    res.status(500).json({ error: 'Error deleting data into the database.' });
  }
})

router.get('/status/View/:id', isAuthenticated, (req, res) => {
  try {
    const sql2t = "SELECT * FROM stockCardStatus WHERE id = ? ;"

    db.query(sql2t, [req.params.id], (err, result) => {
      if (err) throw err;

      res.render('stockCard/stockCardStatusView', {
        title: 'Stock Card Status View',
        stockCardStatus: result[0],
        user: req.session.user
      });
    });
  } catch (err) {
    console.error('Error view data:', err);
    res.status(500).json({ error: 'Error view data into the database.' });
  }
})

module.exports = router;