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
const CryptoJS = require('crypto-js')
 
const verifyToken = require('./auth_mid.js') // middleware

router.get('/sampleLang', verifyToken, (req,res) =>{
    res.json({ message: 'ok'})
})


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
        const token = jwt.sign({ userdetails: body[0] }, process.env.secret_key);

        res.status(200).json({ token:token, userdetails:  body[0] });
        
    } else {
        console.log("Passwords do not match.");
    }
});
    }).catch(error => {
        console.error(error);
        res.status(500).send("Internal Server Error");
    });
});






module.exports = router;