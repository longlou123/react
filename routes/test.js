var express = require('express');
var router = express.Router();
const Sequelize = require('sequelize');
const config = require('../dataconfig/config');

// 创建一个sequelize对象实例：
var sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 30000
    }
});
// 定义模型Pet，告诉Sequelize如何映射数据库表：
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

// 查询成功后会返回包含多个实例（instance）的数组
var queryFromSomewhere = async (animals) =>
{
    var pets = await Pet.findAll({
        where: {
            name: animals||'pig'
        }
    });
    console.log(`find ${pets.length} pets:`);
    for (let p of pets) {
        console.log(JSON.stringify(p));
    }
    return pets;
};

var now = Date.now();
// 添加数据
Pet.create({
    id: 'g-' + now,
    name: '龙楼',
    imgUrl: 'sas',
}).then(function (p) {
    console.log('created.' + JSON.stringify(p));
}).catch(function (err) {
    console.log('failed: ' + err);
});

// await方式
var _add = function(addObj) {
  (async () => {
      var obj = addObj;
      obj.id = 'g-' + now;
      console.log(obj)
      var dog = await Pet.create(obj);
      // console.log('created: ' + JSON.stringify(dog));
  })();
}


//查找数据
var _serch = function(keyWord) {
  (async () => {
      var pets = await Pet.findAll({
          where: {
              name: keyWord
          }
      });
      console.log(`find ${pets.length} pets:`);
      for (let p of pets) {
          console.log(JSON.stringify(p));
          return p.imgUrl;
      }
  })();
}

// 更新数据
var _upData = function(keyWord,imgUrl){
  (async () => {
      var pets = await queryFromSomewhere(keyWord);
      for (let p of pets) {
        p.imgUrl = imgUrl;
        await p.save();
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
      console.log(`find ${pets.length} pets:`);
      for (let p of pets) {
          await p.destroy();
          console.log(JSON.stringify(p));
      }
  })();
}


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/v1/getList', function(req, res, next) {
  // 参数定义 {name: 'll', imgUrl: '888'}
  // var params = req.query;
  // let List = {'name': params.name, 'imgUrl': params.imgUrl}
  // _add(List)
 //  res.json(List);
 (async () => {
      var pets = await Pet.findAll({
          where: {
              // name: 
          }
      });
      console.log(`find ${pets.length} pets:`);
      // for (let p of pets) {
      //     // let ob
      // }
      res.json(pets);
  })();
});

router.get('/api/v1/getImg', function(req, res, next) {
  var params = req.query;
  (async () => {
      var pets = await Pet.findAll({
          where: {
              name: params.name
          }
      });
      console.log(`find ${pets.length} pets:`);
      for (let p of pets) {
          console.log(JSON.stringify(p));
          res.json(p.imgUrl);
          return
      }
  })();
});

module.exports = router;