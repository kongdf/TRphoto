const router = require('koa-router')()

const userService = require('../db/mysqlconfig'); 

let qiniu = require("qiniu"); 

const accessKey = ""; // 七牛账号

const secretKey = "";

let bucket = "";

qiniu.conf.ACCESS_KEY = accessKey;

qiniu.conf.SECRET_KEY = secretKey;

let imageUrl = ""; // 你要上传的域名

let mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

const imgdomain = ""; //创建bucket是七牛自动分配的域名

let options = {
    scope: bucket

};

let config = new qiniu.conf.Config();

config.zone = qiniu.zone.Zone_z2;

var bucketManager = new qiniu.rs.BucketManager(mac, config);

let option = {
    limit: 20
};




router.prefix('/users')

router.get('/', function (ctx, next) {
  ctx.body = ''
})

router.get('/gettoken', async (ctx, next) => {
  
  let options = {
      scope: bucket, 
      expires: 3600 * 24

  };

  let putPolicy = new qiniu.rs.PutPolicy(options);

  let uploadToken = putPolicy.uploadToken(mac);
  console.log(uploadToken)
  if (uploadToken) {
      ctx.body = uploadToken;


  } else {
      ctx.body = "error";

  }
  
})

 

module.exports = router