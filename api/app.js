const express = require('express')
require('dotenv').config()
const port = 12799
const helmet = require('helmet')
const inventory = require('../routes/inventory.js')
const sales = require('../routes/sales.js')
const audit = require('../routes/audit.js')
const category = require('../routes/category.js')
const discount = require('../routes/discount.js')
const account = require('../routes/account.js')
const void_data = require('../routes/void.js')
const login = require('../routes/login.js')
const pending = require('../routes/pending.js')
const storename = require('../routes/storename.js')
const cors = require('cors')


// middleware
const verifyToken = require('../routes/auth_mid.js')
 
const app = express()
app.use(helmet())

app.use(cors())
 
app.use('/inventory' ,verifyToken, inventory)
app.use('/sales', verifyToken,sales)
app.use('/audit', verifyToken,audit)
app.use('/category',verifyToken,category)
app.use('/discount', verifyToken,discount)
app.use('/account' , verifyToken,account)
app.use('/login' ,login)
app.use('/void',verifyToken,void_data)
app.use('/pending',verifyToken,pending)
app.use('/storename',storename)
 
app.listen(port,function(){
	console.log('listening to port ' + port);
})