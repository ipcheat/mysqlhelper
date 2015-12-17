var config = require("nodejsconfig");
var mysql = require('mysql');

var isNullOrEmpty = function (v) {
    
    if (v == undefined)
        return true;
    if (v == null)
        return true;
    if (v.length == 0)
        return true;
    
    return false;

}

var DbInstance = function (instanceKey, poolNumber) {
    
    var dbconfig = config.getItem(instanceKey);
    if (!dbconfig) {
        throw 'dbconfig is not found';
    }
    
    if (typeof poolNumber != 'number' || poolNumber <= 0)
        poolNumber = 10;
    
    var _pool = mysql.createPool(dbconfig);
    
    this.execSql = function (sql, cb) {
        
        _pool.getConnection(function (err, connection) {
            connection.query(sql, function (err, rows, fields) {
                
                if (typeof cb == 'function') {
                    try {
                        cb(err, rows, fields);
                    } catch (e) {
                        console.log("Query failed。"+e);
                    };                    
                }                    
                connection.release();
            });
        })

    }   
    
    this.toString = this.valueOf = function () {
        return 'MysqlDbInstance_' + instanceKey;
    }

}

var DbInstanceCache = function () {
    var _cache = {};
    this.get = function (instanceKey) {
        if (typeof _cache[instanceKey] == 'undefined')
            return null;
        return _cache[instanceKey];
    }
    this.set = function (instanceKey, instance) {
        if (instance == null || instance == undefined)
            return;
        if (instance.toString().indexOf('MysqlDbInstance_') < 0)
            return;
        _cache[instanceKey] = instance;
    }

}

module.exports = (function () {
    
    var _cache = new DbInstanceCache();
    
    return {
        getDbInstance: function (instanceKey, poolNumber) {
            
            if (typeof instanceKey != 'string')
                return null;
            if (isNullOrEmpty(instanceKey))
                return null;
            
            var re = _cache.get(instanceKey);
            if (!re) {
                
                try {
                    re = new DbInstance(instanceKey, poolNumber);
                    _cache.set(instanceKey, re);
                } catch (e) {
                    console.log(e);
                    re = null;
                };
            }
            return re;
        }
    }


})()