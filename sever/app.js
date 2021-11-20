const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
var cors = require('koa2-cors'); 
const users = require('./routes/users') 
const photo = require('./routes/photo')
// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(cors());
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))

// logger
app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*');
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

  
app.use(users.routes(), users.allowedMethods())
 
app.use(photo.routes(), photo.allowedMethods())
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app



