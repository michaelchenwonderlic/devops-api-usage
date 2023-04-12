var Q = require('q');

var sql = require('mssql');

var database = function(sqlConfig) {
  this.getConnection = function() {
    return sql.connect(sqlConfig)
      .then(function(conn) {
        console.log('SQL Server Connected:', sqlConfig.server, sqlConfig.database);

        conn.query = function(query) {
          return conn.request().query(query);
        };

        var _connectionClose = conn.close;
        conn.close = function() {
          _connectionClose();
          console.log('SQL Server Connection Closed:', sqlConfig.server, sqlConfig.database);
        };

        return conn;
      })
  };
};

var databases = {
  // TODO... don't hard-code this...
  wonderliconline: new database({
    user: '<USER>',
    password: '<PASSWORD>',
    server: 'prod-sql.prodsys01.wonderlic.com',
    database: 'WonderlicOnline',
    requestTimeout: 3 * 60 * 1000
  })
};

module.exports = databases;
