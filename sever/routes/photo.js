const router = require('koa-router')()

const userService = require('../db/mysqlphoto.js');


router.prefix('/photo')

router.get('/', function (ctx, next) {
    ctx.body = '1'
})
router.post('/login', async (ctx, next) => {


    let obj = {
        user: ctx.request.body['user'],
        pwd: ctx.request.body['pwd']
    }

    await userService.login(obj).then(async (data) => {

        if (data.length > 0) {
            console.log(data[0].user,'444')
            if(data[0].pwd==obj.pwd){
                ctx.body = {
                    StatusCode: '000000',
                    uid: data[0].uid
                }
            }else{
                ctx.body = {
                    StatusCode: '000002',
                    StatusMsg: '密码错误'
                }
            }

            //已注册
        } else {
            //未注册
            var UUID = require('uuid'); 
            obj.uid=UUID.v1().replace(new RegExp("-", "g"), ""); 
            await userService.resuser(obj).then(data2 => {
                if (data2.affectedRows) {
                    ctx.body = {
                        StatusCode: '000001',
                        uid: obj.uid
                    }
                } else {
                    ctx.body = {
                        StatusCode: '000001',
                        StatusMsg: '添加失败'
                    }
                } 
            }).catch(() => {
                ctx.body = {
                    StatusCode: '100001',
                    StatusMsg: '连接失败'
                }
            })
        }
    }).catch(() => {
        ctx.body = {
            StatusCode: '100001',
            StatusMsg: '连接失败'
        }
    }) 
})

router.post('/list', async (ctx, next) => {

    let uid=ctx.request.body['uid']
    await userService.list(uid).then(data => {
        ctx.body = {
            StatusCode: '000000',
            data
        }
    }).catch(() => {
        ctx.body = {
            StatusCode: '100001',
            StatusMsg: '连接失败'
        }
    })
})
 
router.post('/addPhoto', async (ctx, next) => {

    await userService.addPhoto(ctx.request.body['imgurl'],ctx.request.body['type'],ctx.request.body['uid']).then(data => {
  
      ctx.body = {
        StatusCode: '000001',
        Status: '1',
        data
      }
    }).catch(() => {
      ctx.body = {
        StatusCode: '100001',
        StatusMsg: '连接失败'
      }
    })
  })

  router.post('/del', async (ctx, next) => {
 
    await userService.Del(ctx.request.body['id'],ctx.request.body['uid']).then(data => {
        ctx.body = {
            StatusCode: '000000',
            data
        }
    }).catch(() => {
        ctx.body = {
            StatusCode: '100001',
            StatusMsg: '连接失败'
        }
    })
})
module.exports = router