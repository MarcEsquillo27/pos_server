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
router.get("/api/getAllInvetory", async (req,res)=>{
    const sql = `SELECT inventories.*, discount.discount_value, category.categoryName
    FROM inventories
    LEFT JOIN discount ON inventories.discount_id = discount.id
    LEFT JOIN category ON inventories.categoryID = category.categoryID
    `
    connection.raw(sql).then((body) => {
        res.send(body[0]);
    }).catch(error => {
        console.error(error);
        res.status(500).send("Internal Server Error");
    });
})


router.get("/api/getInventory", async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const pageSize = parseInt(req.query.page_size) || 12; // Default to 12 items per page if not provided
    const offset = (page - 1) * pageSize;

    try {
        const totalItemsQuery = `SELECT COUNT(*) as count FROM inventories`;
        const totalItemsResult = await connection.raw(totalItemsQuery);
        const totalItems = totalItemsResult[0][0].count;

        const sql = `SELECT inventories.*, discount.discount_value, discount.status, category.categoryName
        FROM inventories
        LEFT JOIN discount ON inventories.discount_id = discount.id
        LEFT JOIN category ON inventories.categoryID = category.categoryID
        LIMIT ? OFFSET ?`;

        const productsResult = await connection.raw(sql, [pageSize, offset]);

        res.send({
            products: productsResult[0],
            totalItems: totalItems
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});
//GET PER ITEM
router.get("/api/getPerItem/:item", (req, res) => {
    let item = req.params.item
    let sql = `SELECT inventories.*, discount.discount_value,discount.status
    FROM inventories
    LEFT JOIN discount ON inventories.discount_id = discount.id
    WHERE inventories.productNumber = '${item}' OR inventories.item = '${item}' `;
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
  let categoryID = req.body.categoryID
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
    categoryID,
    description,
    stock,
    originalPrice,
    salesPrice,
    date) 
  VALUES ('${productNumber}','${item}','${unit}','${brand}','${categoryID}','${description}','${stock}','${originalPrice}','${salesPrice}','${date}');`;
  connection.raw(sql).then((body) => {
      res.send(body[0]);
  }).catch(error => {
      console.error(error);
      res.status(500).send("Internal Server Error");
  });
});

//UPDATE INVENTORY
router.post("/api/updateInventory", (req, res) => {
    console.log(req.body,"108");
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
    let promises = [];
    let bodyArray = req.body
    bodyArray.forEach(element => {
        console.log(element,"139")
        let sql = `UPDATE inventories
                   SET stock = ${element.stock}
                   WHERE id = ${element.id}`;
        promises.push(connection.raw(sql));
    });

    Promise.all(promises)
        .then(results => {
            res.send(results.map(result => result[0]));
        })
        .catch(error => {
            console.error(error);
            res.status(500).send("Internal Server Error");
        });
});

module.exports = router;
