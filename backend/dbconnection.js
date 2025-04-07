const pool = require("pg-pool");
const fs = require('fs')

const dbConfig = {
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE,
    ssl: {
      rejectUnauthorized: true,
      ca: fs.readFileSync(
          `${process.cwd()}/ca-cert.crt`.toString()
      ),
      //ca: process.env.CA_CERT,
  },
};


let dbConn = new pool(dbConfig);

dbConn.on('error', (err, client) => {
    logger.error('Unexpected error on idle client', err)
    process.exit(-1)
  })

module.exports = dbConn;
