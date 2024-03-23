const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
const moment = require('moment');
const connection = require("../config/dbConnection"); // Import connection directly
const router = express.Router();

router.use(cors());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
 

//GET ALL INVETORY 
router.get("/api/getInventory", (req, res) => {
    let sql = `SELECT * FROM inventories`;
    connection.raw(sql).then((body) => {
        res.send(body[0]);
    }).catch(error => {
        console.error(error);
        res.status(500).send("Internal Server Error");
    });
});
//GET PER ITEM
router.get("/api/getPerItem/:item", (req, res) => {
    let item = req.params.item
    let sql = `SELECT * FROM inventories WHERE productNumber = '${item}'`;
    connection.raw(sql).then((body) => {
        res.send(body[0]);
    }).catch(error => {
        console.error(error);
        res.status(500).send("Internal Server Error");
    });
});

// INSERT INVENTORY
router.post("/api/addInventory", (req, res) => {
  let productNumber = req.body.productNumber
  let unit = req.body.unit
  let item = req.body.item
  let brand = req.body.brand
  let category = req.body.category
  let description = req.body.description
  let stock = parseInt(req.body.stock)
  let originalPrice = parseInt(req.body.originalPrice)
  let salesPrice = parseInt(req.body.salesPrice)
  let discount = parseInt(req.body.discount)
  let date = req.body.date

  let sql = `INSERT INTO inventories (productNumber,
    item,
    unit,
    brand,
    category,
    description,
    stock,
    originalPrice,
    salesPrice,
    discount,
    date) 
  VALUES ('${productNumber}','${item}','${unit}','${brand}','${category}','${description}','${stock}','${originalPrice}','${salesPrice}','${discount}','${date}');`;
  connection.raw(sql).then((body) => {
      res.send(body[0]);
  }).catch(error => {
      console.error(error);
      res.status(500).send("Internal Server Error");
  });
});

//UPDATE INVENTORY
router.post("/api/updateInventory", (req, res) => {
    console.log(req.body);
    let bodyArray = [req.body]
    let promises = [];
    
    bodyArray.forEach(element => {
        let setValues = Object.keys(element).map(key => `${key} = '${element[key]}'`).join(', ');
        let whereCondition = `productNumber = '${element.productNumber}'`;
        let sql = `UPDATE inventories
                   SET ${setValues}
                   WHERE ${whereCondition};`;
        
        promises.push(connection.raw(sql));
    });

    Promise.all(promises)
        .then(results => {
            res.send(results.map(result => result[0])); // Send an array of results
        })
        .catch(error => {
            console.error(error);
            res.status(500).send("Internal Server Error");
        });
});


//UPDATE INVENTORY LESS STOCK
router.post("/api/updateInventoryStock", (req, res) => {
    console.log(req.body);
    let promises = [];
    
    req.body.forEach(element => {
        let sql = `UPDATE inventories
                   SET stock = '${element.stock}'
                   WHERE productNumber = '${element.productNumber}';`;
        promises.push(connection.raw(sql));
    });

    Promise.all(promises)
        .then(results => {
            res.send(results.map(result => result[0])); // Send an array of results
        })
        .catch(error => {
            console.error(error);
            res.status(500).send("Internal Server Error");
        });
});

module.exports = router;
