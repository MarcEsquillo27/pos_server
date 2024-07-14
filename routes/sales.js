const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
const moment = require('moment');
const connection = require("../config/dbConnection"); // Import connection directly
const router = express.Router();

router.use(cors());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

//GET ALL SALES EXRACTION
router.get("/api/getSalesExtraction/:date1/:date2", (req, res) => {
    let sql = `SELECT s.id,s.salesID,s.productNumber,i.item,i.salesPrice,s.quantity,s.total,s.date 
    FROM sales s 
    LEFT JOIN inventories i 
    ON s.productNumber = i.productNumber
    WHERE s.date BETWEEN '${req.params.date1} 00:00:00' AND '${req.params.date2} 23:59:59'`;
    connection.raw(sql).then((body) => {
        res.send(body[0]);
    }).catch(error => {
        console.error(error);
        res.status(500).send("Internal Server Error");
    });
});

//GET ALL SALES 
router.get("/api/getSales/:date1/:date2", (req, res) => {
    let sql = `SELECT s.salesID, COUNT(*) AS item_count, SUM(s.total) AS total_sum,s.transaction_by, s.date
    FROM sales s 
    WHERE s.date BETWEEN '${req.params.date1} 00:00:00' AND '${req.params.date2} 23:59:59'
    GROUP BY s.salesID, s.date,s.transaction_by
    ORDER BY s.date DESC
    `;
    connection.raw(sql).then((body) => {
        res.send(body[0]);
    }).catch(error => {
        console.error(error);
        res.status(500).send("Internal Server Error");
    });
});

router.get("/api/getAllSales", (req, res) => {
    let sql = `SELECT salesID, item_count, total_sum
    FROM (
        SELECT s.salesID, COUNT(*) AS item_count, SUM(s.total) AS total_sum, MAX(s.date) AS date
        FROM sales s
        GROUP BY s.salesID
    ) AS subquery
    ORDER BY date DESC;`;
    connection.raw(sql).then((body) => {
        res.send(body[0]);
    }).catch(error => {
        console.error(error);
        res.status(500).send("Internal Server Error");
    });
});
//GET SALES by salesID
router.get("/api/getbySalesId/:salesID", (req, res) => {
    let sql = `SELECT s.id,s.salesID,s.productNumber,i.item,i.salesPrice,s.quantity,i.stock,s.total,i.date 
    FROM sales s 
    LEFT JOIN inventories i 
    ON s.productNumber = i.productNumber
    WHERE s.salesID = '${req.params.salesID}'`;
    connection.raw(sql).then((body) => {
        res.send(body[0]);
    }).catch(error => {
        console.error(error);
        res.status(500).send("Internal Server Error");
    });
});

// INSERT SALES
router.post("/api/addSales/:name", (req, res) => {
    let promises = [];
    
    req.body.forEach(element => {
        // element.salesID = moment().format("YYYYMMDDhhmmss")
        let sql = `INSERT INTO sales (salesID,productNumber, quantity, total,transaction_by,date)
        VALUES ('${element.salesID}','${element.productNumber}','${element.quantity}','${element.subtotal}','${req.params.name}','${moment(element.data).format("YYYY-MM-DD hh:mm:ss")}');`;
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

// UPDATE STOCK
router.post("/api/updateInventoryStock", (req, res) => {
    // console.log(req.body);
    let promises = [];
    
    // req.body.forEach(element => {
        let sql = `UPDATE inventories
                   SET stock = '${req.body.stock}'
                   WHERE productNumber = '${req.body.productNumber}';`;
        promises.push(connection.raw(sql));
    // });

    Promise.all(promises)
        .then(results => {
            res.send(results.map(result => result[0])); // Send an array of results
        })
        .catch(error => {
            console.error(error);
            res.status(500).send("Internal Server Error");
        });
});
router.post("/api/updateInventoryStockReturn", (req, res) => {
    console.log(req.body);
    let promises = [];
    
    // req.body.forEach(element => {
        let sql = `UPDATE inventories
                   SET stock = '${req.body.stock}'
                   WHERE productNumber = '${req.body.productNumber}';`;
        promises.push(connection.raw(sql));
    // });

    Promise.all(promises)
        .then(results => {
            res.send(results.map(result => result[0])); // Send an array of results
        })
        .catch(error => {
            console.error(error);
            res.status(500).send("Internal Server Error");
        });
});

router.post("/api/updateSales", (req, res) => {
    console.log(req.body);
    let promises = [];
    
    // req.body.forEach(element => {
        let sql = `UPDATE sales SET quantity = ${req.body.quantity}, total = ${req.body.total}, productNumber = '${req.body.productNumber}'
                   WHERE id = ${req.body.id}`;
        promises.push(connection.raw(sql));
    // });

    Promise.all(promises)
        .then(results => {
            res.send(results.map(result => result[0])); // Send an array of results
        })
        .catch(error => {
            console.error(error);
            res.status(500).send("Internal Server Error");
        });
});

//DELETE SALES ID
router.get("/api/deletebySalesId/:id", (req, res) => {
    let sql = `DELETE FROM sales WHERE id=${req.params.id}`;
    connection.raw(sql).then((body) => {
        res.send(body[0]);
    }).catch(error => {
        console.error(error);
        res.status(500).send("Internal Server Error");
    });
});
module.exports = router;
