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


//GET ALL INVETORY 
router.get("/api/getAccount", (req, res) => {
    let sql = `SELECT * FROM accounts`;
    connection.raw(sql).then((body) => {
        res.send(body[0]);
    }).catch(error => {
        console.error(error);
        res.status(500).send("Internal Server Error");
    });
});
//GET PER ITEM
router.get("/api/getPerAccount/:username/:password", (req, res) => {
    let username = req.params.username
    let sql = `SELECT * FROM accounts WHERE username = '${username}'`;
    connection.raw(sql).then((body) => {
  
        let hashed_password = body[0][0].password
        const plainTextPassword = req.params.password;

// Assuming storedHashedPassword is the hashed password stored in the database
const storedHashedPassword = hashed_password;

bcrypt.compare(plainTextPassword, storedHashedPassword, function(err, result) {
    if (err) {
        // Handle error
    }
    if (result) {
        console.log("Passwords match!");
        const token = jwt.sign({ userdetails: body[0] }, process.env.secret_key, {expiresIn: '3h' });
        res.status(200).json({ token, userdetails:  body[0] });
    
    } else {
        console.log("Passwords do not match.");
    }
});
    }).catch(error => {
        console.error(error);
        res.status(500).send("Internal Server Error");
    });
});

// INSERT INVENTORY
router.post("/api/addAccount", (req, res) => {
    var cryp_password  = ""

    const saltRounds = 10;

bcrypt.hash(req.body.password, saltRounds)
  .then(hash => {
        cryp_password = hash
        let username = req.body.username
        let password = cryp_password
        let fullname = req.body.fullname
        let access = JSON.stringify(req.body.access)
        let drawer_access = JSON.stringify(req.body.drawer_access)
            let sql = `INSERT INTO accounts (username,
                        password,
                        fullname,
                        access,
                        drawer_access) 
                        VALUES ('${username}','${password}','${fullname}','${access}','${drawer_access}');`;
            connection.raw(sql).then((body) => {
            res.send(body[0]);
            }).catch(error => {
            console.error(error);
            res.status(500).send("Internal Server Error");
            });
  })
  .catch(err => {
  });
    

  
//   let username = req.body.username
//   let password = req.body.password
//   let type = req.body.type


});

//UPDATE INVENTORY
router.post("/api/updateAccount", (req, res) => {

    const saltRounds = 10;
    bcrypt.hash(req.body.password, saltRounds)
  .then(hash => {
    req.body.password = hash
        let username = req.body.username
        let fullname = req.body.fullname
        req.body.access = JSON.stringify(req.body.access)
        req.body.drawer_access = JSON.stringify(req.body.drawer_access)

         let bodyArray = [req.body]
    let promises = [];
    
    bodyArray.forEach(element => {
        console.log(element.id)
        let setValues = Object.keys(element).map(key => `${key} = '${element[key]}'`).join(', ');
        let whereCondition = `id = '${element.id}'`;
        let sql = `UPDATE accounts
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
  })
   
});

router.post("/api/deleteAccount", (req, res) => {
    let id = req.body.id
    console.log(id)
    let sql = `DELETE FROM accounts WHERE id = '${id}';`
    connection.raw(sql)
    .then(result => {
        res.send(result[0]);
        })
        .catch(error => {
            console.error(error);
            res.status(500).send("Internal Server Error");
        })
})


module.exports = router;