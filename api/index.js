const express = require('express')
const port = 12799
const helmet = require('helmet')
const inventory = require('../routes/inventory.js')
const sales = require('../routes/sales.js')
const audit = require('../routes/audit.js')
const category = require('../routes/category.js')
const discount = require('../routes/discount.js')
const account = require('../routes/account.js')
const void_data = require('../routes/void.js')
 
const app = express()
app.use(helmet())
 
app.use('/inventory' ,verifyToken, inventory)
app.use('/sales', verifyToken,sales)
app.use('/audit', verifyToken,audit)
app.use('/category',category)
app.use('/discount', verifyToken,discount)
app.use('/account' , verifyToken,account)
app.use('/delivery' , verifyToken,delivery)
app.use('/login' ,login)
app.use('/void',verifyToken,void_data)
app.use('/pending',verifyToken,pending)
app.use('/storename',storename)
app.use('/pwd',verifyToken,pwd)
 
app.listen(port,function(){
	console.log('listening to port ' + port);
})