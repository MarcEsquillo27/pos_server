const knex = require("knex");

const connection = knex({
    client: "mysql",
    connection: {
        host: "auth-db612.hstgr.io",
        user: "u453296495_root",
        password: "hpO$is2024",
        database: "u453296495_hposis_db",
        port: 3306,
        connectTimeout: 10000,
        // options: {
        //     enableArithAbort: false,
        //     encrypt: false,
        // },
    },
    acquireConnectionTimeout: 10000,
    pool: {
        min: 0,
        max: 10,
        acquireTimeoutMillis: 10000,
        createTimeoutMillis: 10000,
        idleTimeoutMillis: 10000,
        reapIntervalMillis: 1000,
    },
});

// const connection = knex({
//     client: "mysql",
//     connection: {
//         host: "localhost",
//         user: "root",
//         password: "admin",
//         database: "pos",
//         port: 3306,
//         // options: {
//         //     enableArithAbort: false,
//         //     encrypt: false,
//         // },
//         pool: {
//             max: 25,
//             min: 0,
//             idle: 10000
//         },
//     },
// });
module.exports = connection;
