const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
const moment = require('moment');
const connection = require("../config/dbConnection"); // Import connection directly
const router = express.Router();

router.use(cors());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
 

//GET ALL SALES 
router.get("/api/getLogs/:startDate/:endDate", (req, res) => {
    let sql = `SELECT * FROM logs WHERE date BETWEEN '${req.params.startDate} 00:00:00' AND '${req.params.endDate} 23:59:59'`;
    connection.raw(sql).then((body) => {
        res.send(body[0]);
    }).catch(error => {
        console.error(error);
        res.status(500).send("Internal Server Error");
    });
});

// INSERT AUDIT
router.post("/api/addLogs", (req, res) => {
    console.log(req.body)
    let bodyArr = [req.body]
    let promises = [];
    
    bodyArr.forEach(element => {
        let sql = `INSERT INTO logs (action,description, product_number, quantity,drawerLink,date)
        VALUES ('${element.action}','${element.description}','${element.product_number}','${element.quantity}','${element.drawer_link}','${moment(element.data).format("YYYY-MM-DD hh:mm:ss")}');`;
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
