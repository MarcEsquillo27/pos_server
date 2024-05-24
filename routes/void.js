const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
const moment = require('moment');
const connection = require("../config/dbConnection"); // Import connection directly
const router = express.Router();

router.use(cors());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

//GET ALL VOID RECORD

router.get("/api/getVoid/:date1/:date2", (req, res) => {
    let sql = `SELECT *
    FROM void WHERE date BETWEEN '${req.params.date1} 00:00:00' AND '${req.params.date2} 23:59:59'`;
    connection.raw(sql).then((body) => {
        res.send(body[0]);
    }).catch(error => {
        console.error(error);
        res.status(500).send("Internal Server Error");
    });
});




// INSERT SALES
router.post("/api/addVoid", (req, res) => {
    // console.log(req.body)
    let promises = [];
    
    req.body.forEach(element => {
        element.salesID = moment().format("YYYYMMDDhhmmss")
        let sql = `INSERT INTO void (productNumber,item, quantity, date)
        VALUES ('${element.productNumber}','${element.item}','${element.quantity}','${moment().format("YYYY-MM-DD hh:mm:ss")}');`;
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
