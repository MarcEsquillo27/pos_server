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
 
app.use('/inventory',inventory)
app.use('/sales',sales)
app.use('/audit',audit)
app.use('/category',category)
app.use('/discount',discount)
app.use('/account',account)
app.use('/void',void_data)
 
app.listen(port,function(){
	console.log('listening to port ' + port);
})