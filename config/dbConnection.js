const knex = require("knex");

const connection = knex({
    client: "mysql",
    connection: {
        host: "localhost",
        user: "root",
        password: "admin",
        database: "pos",
        port: 3306,
        options: {
            enableArithAbort: false,
            encrypt: false,
        },
    },
});

module.exports = connection;