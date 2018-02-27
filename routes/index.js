var express = require('express');
var router = express.Router();
const Sequelize = require('sequelize');
const config = require('../dataconfig/config');

var sequelize = new Sequelize(config.database, config.username, config.password, {
        host: config.host,
        dialect: 'mysql',
        pool: {
            max: 5,
            min: 0,
            idle: 30000
        }
    });
var Pet = sequelize.define('pet', {
    id: {
        type: Sequelize.STRING(50),
        primaryKey: true
    },
    name: Sequelize.STRING(100),
    imgUrl: Sequelize.STRING(100),
}, {
        timestamps: false
    });
//添加新数据接口---------------------------------------；
router.post('/add', function(req, res) {	
	var name = req.body.name;
	var imgUrl = req.body.imgUrl;
    addData(name,imgUrl);
    res.sendStatus(200);	
})

//上传文件数据接口---------------------------------------；
router.post('/Upload', function(req, res) {   
    // 解析一个文件上传
    console.log("00099999999999999999999")
    var form = new multiparty.Form();
    //设置文件存储路径
    console.log("我欧诺个了")
    // form.uploadDir = "uploads/images/";
    // //设置单文件大小限制
    // form.maxFilesSize = 2 * 1024 * 1024;
    // //form.maxFields = 1000;  设置所以文件的大小总和
    // //解析表单数据
    // form.parse(req, function(err, fields, files) {
    //     //fields:非文件内容；files：文件内容
    //     console.log(files.originalFilename);
    //     console.log(files.path);
    //     //重命名文件名
    //     fs.rename(oldPath,newPath,(err) => {
    //         if (err) throw err;
    //         //具体操作
    //     });
    // });
    res.sendStatus(200); 
})
//添加数据
var addData = function(keyWord,imgUrl) {
  (async () => {
      var pets = await Pet.findAll({
          where: {
              name: keyWord
          }
      });
      //判断是否已经存在;
      if(pets.length > 0){
        (async () => {
            console.log(pets.length);
            for (let p of pets) {
                p.imgUrl = imgUrl;
                await p.save();
              }
        })();
      }else{
        (async () => {
             var now = Date.now();
             var dog = await Pet.create({
             id: 'd-' + now,
             name: keyWord,
             imgUrl:imgUrl
             });
         })();
      }    
  })();
}
// 删除数据
var _destroy = function(deleteName){
  (async () => {
      var pets = await Pet.findAll({
          where: {
              name: deleteName
          }
      });
      //console.log(`find ${pets.length} pets:`);
      for (let p of pets) {
          await p.destroy();
          console.log(JSON.stringify(p));
      }
  })();
}
//删除数据接口---------------------------------------;
router.post('/delete', function(req, res) {    
    var name = req.body.name;
    _destroy(name);
    res.sendStatus(200);    
})
//更新数据
var _upData = function(keyWord,imgUrl){
  (async () => {
    var pets = await Pet.queryFromSomewhere(keyWord);
     for (let p of pets) {
        p.imgUrl = imgUrl;
        await p.save();
      }  
  })();
}

//获取全部数据接口---------------------------------------;
router.get('/', function(req, res, next) {
	var name = req.query.name
    var arr = []; 
    (async () =>{
    // var pets = await Pet.findAll({
    //     where: {
    //         name: name
    //     }
    // });  按条件搜索获取
    var pets = await Pet.findAll();  //全都获取
    console.log(`find ${pets.length} pets:`);
    for (let p of pets) {
        var data = JSON.stringify(p)
        arr.push(data)
    }
    if(arr){
    	var nth = arr.length-1
    	//res.json(arr[nth]);
        res.json(arr);
    }else{
    	 res.status(500).json({ error: 'message' });
    }   
    //console.log(arr);
    //res.render('test', { title: arr });    
    })()
    
});
module.exports = router;

