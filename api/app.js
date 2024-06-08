const express = require('express');
require('dotenv').config();
const https = require('https'); // Use the 'https' module instead of 'http'
const fs = require('fs'); // Node's file system module
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
app.use(cors());

// Specify the path to your SSL certificate and private key
const sslOptions = {
	key: fs.readFileSync('../../../etc/ssl/certs/SSL.com_TLS_ECC_Root_CA_2022.pem'),
	cert: fs.readFileSync('../../../etc/ssl/certs/SSL.com_TLS_RSA_Root_CA_2022.pem')
  };
  

// Use HTTPS instead of HTTP
const port = 12799;
const server = https.createServer(sslOptions, app);

// Use your middleware and routes
app.use('/inventory', verifyToken, inventory);
app.use('/sales', verifyToken, sales);
app.use('/audit', verifyToken, audit);
app.use('/category', verifyToken, category);
app.use('/discount', verifyToken, discount);
app.use('/account', verifyToken, account);
app.use('/login', login);
app.use('/void', verifyToken, void_data);

server.listen(port, function () {
  console.log('HTTPS server listening on port ' + port);
});
