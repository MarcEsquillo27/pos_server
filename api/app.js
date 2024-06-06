const express = require('express');
require('dotenv').config();
const https = require('https');
const fs = require('fs');
const helmet = require('helmet');
const inventory = require('../routes/inventory.js');
const sales = require('../routes/sales.js');
const audit = require('../routes/audit.js');
const category = require('../routes/category.js');
const discount = require('../routes/discount.js');
const account = require('../routes/account.js');
const void_data = require('../routes/void.js');
const login = require('../routes/login.js');
const cors = require('cors');
const verifyToken = require('../routes/auth_mid.js');

const app = express();
app.use(helmet());

app.use(cors({
  origin: 'https://pos-hardware-api.com', // Change this to your domain
  credentials: true
}));

app.use('/inventory', verifyToken, inventory);
app.use('/sales', verifyToken, sales);
app.use('/audit', verifyToken, audit);
app.use('/category', verifyToken, category);
app.use('/discount', verifyToken, discount);
app.use('/account', verifyToken, account);
app.use('/login', login);
app.use('/void', verifyToken, void_data);

// HTTPS options
const httpsOptions = {
	key: fs.readFileSync('../../etc/ssl/private/your_private_key.key'), // Path to your private key
	cert: fs.readFileSync('../../etc/ssl/certs/your_certificate.crt') // Path to your SSL/TLS certificate
  };
  
const port = 443; // HTTPS default port

// Create HTTPS server
https.createServer(httpsOptions, app).listen(port, function() {
  console.log('HTTPS server listening on port ' + port);
});
