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
router.get("/api/getCategory", (req, res) => {
    let sql = `SELECT * FROM category ORDER BY date DESC`;
    connection.raw(sql).then((body) => {
        res.send(body[0]);
    }).catch(error => {
        console.error(error);
        res.status(500).send("Internal Server Error");
    });
});

// INSERT INVENTORY
router.post("/api/addCategory", (req, res) => {
console.log(req.body)
  let categoryID = req.body.categoryID
  let categoryName = req.body.categoryName
  let description = req.body.description
  let date = req.body.date
 

  let sql = `INSERT INTO category (
    categoryID,
    categoryName,
    description,
    date) 
  VALUES ('${categoryID}','${categoryName}','${description}','${date}');`;
  connection.raw(sql).then((body) => {
      res.send(body[0]);
  }).catch(error => {
      console.error(error);
      res.status(500).send("Internal Server Error");
  });
});

//UPDATE INVENTORY
router.post("/api/updateCategory", (req, res) => {
    console.log(req.body);
    let bodyArray = [req.body]
    let promises = [];
    
    bodyArray.forEach(element => {
        let setValues = Object.keys(element).map(key => `${key} = '${element[key]}'`).join(', ');
        let whereCondition = `id = '${element.id}'`;
        let sql = `UPDATE category
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



module.exports = router;
