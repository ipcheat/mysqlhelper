# mysqlhelper

在mysql nodejs基础上做了封装，以便从配置中读取数据设置，并支持多数据库实例调用<br/>
此封装依赖“mysql”和“nodejsconfig”<br/>
当前版本只做了最基本的封装，后续还要继续完善<br/><br/>

使用范例：<br/>
<pre>

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

</pre>




