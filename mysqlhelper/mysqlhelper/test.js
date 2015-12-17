var mysql = require('./mysqlhelper.js');

mysql.getDbInstance("mysqldb").execSql("select * from city limit 0,100;select count(1) from city;", function (error,rows,fileds) {
    
    if (error) {
        console.log(error);
        return;
    }

    if (rows) {
        for (var rowno in rows) {
        
            var row = rows[rowno];
            var buf = [];
            for (var colno in row) {
            
                var col = row[colno];
                buf.push(colno + ":" + col + '  ');              

            }
            console.log(buf.join(''));
        }
    }

});