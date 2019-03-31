const Koa = require('koa')
const path = require('path')
const static = require('koa-static')
const app = new Koa()
 
app.use(static(
  path.join( __dirname,  './', 'static')
))

app.use(async ctx => {
  ctx.response.redirect('/index.html')
})
 
app.listen(3000, () => {
  console.log('server is starting at port 3000')
})