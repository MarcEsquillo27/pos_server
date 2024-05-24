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
router.get("/api/getDiscountItem", (req, res) => {
    let sql = `SELECT inventories.productNumber,inventories.item,inventories.description,inventories.stock,discount.discount_value AS discount_value,discount.id AS discount_id,discount.discount_value FROM inventories JOIN discount ON discount.id = inventories.discount_id`;
    connection.raw(sql).then((body) => {
        res.send(body[0]);
    }).catch(error => {
        console.error(error);
        res.status(500).send("Internal Server Error");
    });
});

//GET ALL INVETORY 
router.get("/api/getDiscount", (req, res) => {
    let sql = `SELECT * FROM discount`;
    connection.raw(sql).then((body) => {
        res.send(body[0]);
    }).catch(error => {
        console.error(error);
        res.status(500).send("Internal Server Error");
    });
});
// INSERT INVENTORY
router.post("/api/addDiscount", (req, res) => {
  let discount_name = req.body.discount_name
  let discount_value = req.body.discount_value

  let sql = `INSERT INTO discount (discount_name,discount_value) 
  VALUES ('${discount_name}','${discount_value}');`;
  connection.raw(sql).then((body) => {
      res.send(body[0]);
  }).catch(error => {
      console.error(error);
      res.status(500).send("Internal Server Error");
  });
});

module.exports = router;
