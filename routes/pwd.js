const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
const moment = require('moment');
const connection = require("../config/dbConnection"); // Import connection directly
const router = express.Router();

router.use(cors());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
 
//GET PWD
router.get("/api/getPwd/:date1/:date2", (req, res) => {
    let sql = `SELECT *
    FROM pwd_logs WHERE date BETWEEN '${req.params.date1} 00:00:00' AND '${req.params.date2} 23:59:59' ORDER BY date DESC`;
    connection.raw(sql).then((body) => {
        res.send(body[0]);
    }).catch(error => {
        console.error(error);
        res.status(500).send("Internal Server Error");
    });
});
// INSERT PWD
router.post("/api/addPwdDetails", (req, res) => {
    console.log(req.body)
  let {birth_date,age,pwd_id,last_name,first_name,middle_name,sex,sales_id,date}= req.body
  
    let sql = `INSERT INTO pwd_logs (birth_date,
      age,
      pwd_id,
      last_name,
      first_name,
      middle_name,
      sex,
      sales_id,
      date
      ) 
    VALUES ('${birth_date}','${age}','${pwd_id}','${last_name}','${first_name}','${middle_name}','${sex}','${sales_id}','${date}');`;
    connection.raw(sql).then((body) => {
        res.send(body[0]);
    }).catch(error => {
        console.error(error);
        res.status(500).send("Internal Server Error");
    });
});
module.exports = router;
