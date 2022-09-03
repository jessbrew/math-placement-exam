const sql = require('mssql')
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    server: process.env.DB_HOST,
    database: process.env.DB_Database,
    stream: false,
    options: {
        trustedConnection: true,
        encrypt: true,
        enableArithAbort: true,
        trustServerCertificate: true,
    },
};
function getAnswers() {
    const result = []
    var tt = "test"
    var redo = []
    var dbConn = new sql.ConnectionPool(dbConfig);
    // var dbConn = new sql.Connection(dbConfig);
    dbConn.connect().then(function () {
        var request = new sql.Request(dbConn);
        // request.query("select * from answers", function(data){
        //     let result = data.
        // }) 
        request.query("select * from answers", function (err, data) {
            let entries = data.recordset
            let test = Array.from(entries)
            for (i = 0; i < test.length; i++) {
                // result.push(toString(test[i]))
                result.push(test[i])
                // console.log(result)
            }
            // console.log(data.recordset.columns)
            // console.log(data.recordset.at(1))
            // let dat = []
            // console.log(result)
            // console.log(result.length)
            // result.toString
            // console.log(result)\
            // dat.push(data.recordset)
            // console.log(dat)

        });
        // console.log(dat)
        // console.log(result)
        // console.log(tmp)
    })
    return redo
}

module.exports = getAnswers()