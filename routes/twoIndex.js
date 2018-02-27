var express = require('express');
var router = express.Router();
var mysql = require('mysql');
const Sequelize = require('sequelize');
const config = require('../dataconfig/config');

var connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'1',
    database:'test',
    port: 3306 // 端口号，MySQL默认3306
})
connection.connect();

router.post('/add', function(req, res) {	
	var name = req.body.name;
	var imgUrl = req.body.imgUrl;

	if(name&&imgUrl){
        //增加数据
        var now = Date.now();
    	var addsql = 'INSERT INTO pets(name,imgUrl,id) VALUES(?,?,?)';
        var addsqlparams = [name,imgUrl,'d-'+now];
        connection.query(addsql,addsqlparams,function (err,result) {
          if(err){
            console.log('error');
            return;
          }
          //console.log('-----------------新增成功----------------');
          //console.log(result);
          res.sendStatus(200);
        })
        
        
            // var modsql = 'UPDATE pets SET imgUrl = ? WHERE name = ?';
            // var modsqlparams = [imgUrl,name];
            // connection.query(modsql,modsqlparams,function (err,result) {
            //   if(err){
            //     console.log(0000)
            //     console.log('err');
            //     return;
            //   }
            //   console.log('--------------------------------');
            //   //console.log(result);
            //   console.log('--------------------------------');
            // }) 
          	
	}else{
	    res.status(500).json({ error: '失败' });
	}	
})
/* GET home page. */
router.get('/', function(req, res, next) {
	//console.log(req.query.name);
    var arr = []; 
    var sql = 'SELECT * FROM pets';
        connection.query(sql,function (err,result) {
          if(err){
            console.log('error');
            return;
          }
          console.log(result);
          for (let p of result) {
                var data = JSON.stringify(p)
                arr.push(data)
            }
            if(arr){
                res.json(arr);
            }else{
                 res.status(500).json({ error: 'message' });
            } 
        })    
});
module.exports = router;

