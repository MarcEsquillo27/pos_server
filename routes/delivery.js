const express = require('express')
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser')
const cors = require('cors');
const moment = require('moment');
const connection = require("../config/dbConnection"); // Import connection directly
const router = express.Router();
const jwt = require('jsonwebtoken');
router.use(cors());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
 
const verifyToken = require('./auth_mid.js') // middleware

router.get('/sampleLang', verifyToken, (req,res) =>{
    res.json({ message: 'ok'})
})

//SEARC DELIVERY BY ID
router.get("/api/searchSalesID/:salesID", (req, res) => {
    // console.log(req.params.salesID)
    let sql = `SELECT *
        FROM deliveryschedule
    WHERE salesID = '${req.params.salesID}'
        ORDER BY id desc
    `;
    connection.raw(sql).then((body) => {
        res.send(body[0]);
    }).catch(error => {
        console.error(error);
        res.status(500).send("Internal Server Error");
    });
});
//GET ALL INVETORY 
router.get("/api/getDelivery",  async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const pageSize = parseInt(req.query.page_size) || 12; // Default to 12 items per page if not provided
    const offset = (page - 1) * pageSize;

    try {
        const totalItemsQuery = `SELECT COUNT(*) as count FROM deliveryschedule`;
        const totalItemsResult = await connection.raw(totalItemsQuery);
        const totalItems = totalItemsResult[0][0].count;

        const sql = `SELECT *
        FROM deliveryschedule
        ORDER BY id desc
        LIMIT ? OFFSET ?`;

        const productsResult = await connection.raw(sql, [pageSize, offset]);

        res.send({
            delivery: productsResult[0],
            totalDeliver: totalItems
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// INSERT DELIVERY
router.post("/api/addDelivery", (req, res) => {
    // console.log(req.body)
    let salesID = req.body.salesID
    let name = req.body.name
    let transaction_by = req.body.transaction_by
    let address = req.body.address
    let contact = req.body.contact
    let shipment_date = req.body.shipment_date
    let shipment_time = req.body.shipment_time + ':00'
  
    let sql = `INSERT INTO deliveryschedule (salesID,name,
      address,
      contact,
      transaction_by,
      shipment_date,
      shipment_time
     ) 
    VALUES ('${salesID}','${name}','${address}','${contact}','${transaction_by}','${shipment_date}','${shipment_time}');`;
    connection.raw(sql).then((body) => {
        res.send(body[0]);
    }).catch(error => {
        console.error(error);
        res.status(500).send("Internal Server Error");
    });
  });

//UPDATE INVENTORIES
router.put("/api/updateDelivery", (req, res) => {
    let id = req.body.id
    let date = moment().format("YYYY-MM-DD HH:mm:ss")
    let sql = `UPDATE deliveryschedule
    SET delivery_date = '${date}', delivery_status = 'Finished'
    WHERE id = ${id}`;
    connection.raw(sql).then((body) => {
        res.send(body[0]);
    }).catch(error => {
        console.error(error);
        res.status(500).send("Internal Server Error");
    });
});

// router.post("/api/deleteAccount", (req, res) => {
//     let id = req.body.id
//     console.log(id)
//     let sql = `DELETE FROM accounts WHERE id = '${id}';`
//     connection.raw(sql)
//     .then(result => {
//         res.send(result[0]);
//         })
//         .catch(error => {
//             console.error(error);
//             res.status(500).send("Internal Server Error");
//         })
// })


module.exports = router;