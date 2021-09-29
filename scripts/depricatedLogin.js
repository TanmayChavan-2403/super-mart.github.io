// var mysql = require('mysql');

require(['mysql'], function(_mysql){
    var conn  = _mysql.createConnection({host: 'localhost',user: 'root', password: 'root',database: 'superMarket'
                })

    function login(username, password){
        conn.connect(function(err){
            if (err){
                console.log(err);
            }
            else{
                conn.query(`insert into users value(${username},${password})`, function(err, result, fields){
                    if (err){
                        console.log(err);
                    }
                    else{
                        console.log(result);
                        conn.destroy();
                    }
                })
            }
        });
    }

})
