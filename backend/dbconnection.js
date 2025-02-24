const pool = require("pg-pool");

const dbConfig = {
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
    // stream: false,
    // ssl: true
    // options: {
    //     trustedConnection: true,
    //     encrypt: true,
    //     enableArithAbort: true,
    //     trustServerCertificate: true,
    // },
};


let dbConn = new pool(dbConfig);

dbConn.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
  })

module.exports = dbConn;
