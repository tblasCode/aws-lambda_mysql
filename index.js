const uuid = require("uuid/v4");
var mysql = require('mysql');


const connection = mysql.createConnection({
  host     : process.env.RDS_HOSTNAME,
  user     : process.env.RDS_USERNAME,
  password : process.env.RDS_PASSWORD,
  port     : process.env.RDS_PORT,
  database : process.env.RDS_DATABASE
});

exports.handler = (event, context, callback) => {
    console.log('Init');
    
    let body = event;
     
    console.log('Received data:', body);
    
    connection.connect(function(err) {
        if (err) throw err;
          console.log("Connected!");
          var id = uuid();
          var created = Date.now();
          var sql = `INSERT INTO ${process.env.RDS_DB_TABLE} (id,created,name,surname,dni) VALUES ('${id}', ${created}, '${body.name}', '${body.surName}', '${body.dni}')`;
          console.log("Sql:",sql);

          connection.query(sql, function (err, result) {
            if (err) throw err;
            console.log("Number of records inserted: " + result.affectedRows);
            connection.end();
            callback(null, result);
          });
  });
};
