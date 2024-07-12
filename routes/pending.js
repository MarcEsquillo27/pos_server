const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
const moment = require('moment');
const connection = require("../config/dbConnection"); // Import connection directly
const router = express.Router();

router.use(cors());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
 


router.get("/api/deletePending/:id", (req, res) => {
    console.log(req.params.id)
    let id = req.params.id
    let date = moment().format("YYYY-MM-DD HH:mm:ss")
    let sql = `UPDATE pending
    SET deleted_date = '${date}'
    WHERE id = ${id}`;
    connection.raw(sql).then((body) => {
        res.send(body[0]);
    }).catch(error => {
        console.error(error);
        res.status(500).send("Internal Server Error");
    });
});

router.get("/api/getPending", (req, res) => {
    let sql = `SELECT * FROM pending WHERE deleted_date IS NULL`;
    connection.raw(sql).then((body) => {
        res.send(body[0]);
    }).catch(error => {
        console.error(error);
        res.status(500).send("Internal Server Error");
    });
});


// INSERT INVENTORY
router.post("/api/addPending", (req, res) => {
    console.log(req.body.children)
  let id_pending = req.body.id
  let name = req.body.name
  let children = JSON.stringify(req.body.children)
  let expanded = req.body.expanded = false?0:1;
  let date = moment().format("YYYY-MM-DD HH:mm:ss")


  let sql = `INSERT INTO pending (id_pending,
    name,
    children,
    expanded,
    date) 
  VALUES ('${id_pending}','${name}','${children}','${expanded}','${date}');`;
  connection.raw(sql).then((body) => {
      res.send(body[0]);
  }).catch(error => {
      console.error(error);
      res.status(500).send("Internal Server Error");
  });
});
module.exports = router;
