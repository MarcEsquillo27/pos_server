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


router.post("/api/getPerAccount", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    try {
        const accounts = await connection("accounts")
            .where({ username })
            .select("*");

        if (accounts.length === 0) {
            return res.status(401).json({ message: "Invalid username or password." });
        }

        const passwordMatches = await bcrypt.compare(password, accounts[0].password);

        if (!passwordMatches) {
            return res.status(401).json({ message: "Invalid username or password." });
        }

        const token = jwt.sign(
            { userdetails: accounts },
            process.env.secret_key,
            { expiresIn: "2h" }
        );

        return res.status(200).json({ token, userdetails: accounts });
    } catch (error) {
        console.error("Login database error:", error);
        return res.status(503).json({
            message: "The login service is temporarily unavailable."
        });
    }
});






module.exports = router;
