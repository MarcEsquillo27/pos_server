const express = require('express')
const port = 12799
const helmet = require('helmet')
const inventory = require('./routes/inventory.js')
const sales = require('./routes/sales.js')
const audit = require('./routes/audit.js')
const category = require('./routes/category.js')
 
const app = express()
app.use(helmet())
 
app.use('/inventory',inventory)
app.use('/sales',sales)
app.use('/audit',audit)
app.use('/category',category)
 
app.listen(port,function(){
	console.log('listening to port ' + port);
})