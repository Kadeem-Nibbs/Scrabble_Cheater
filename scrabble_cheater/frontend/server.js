
let express = require('express')
let proxy = require('http-proxy-middleware')
let app = express()
let https = require('https')
let fs = require('fs')

let port
let sslPath
let options

// To test  from terminal:
// To test the production build locally run:
//  `NODE_ENV=local_production_test npm run serve`
//  Must have ran `yarn build` first.
// Use `yarn dev` server for developing
if(process.env.NODE_ENV === 'local_production_test') {
  port = 3000
  sslPath = ''
  options = {}
} else {
   port = 80
   sslPath = '/etc/letsencrypt/live/www.wordswithfiends.com/'
   options = {
      key: fs.readFileSync(sslPath + 'privkey.pem'),
      cert: fs.readFileSync(sslPath + 'fullchain.pem')
  }
}


app.use('/dist', express.static('dist'))
app.use(express.static(__dirname + '/dist'))
app.use(require('helmet')())

let wsProxy = proxy('/', {
  target: 'http://0.0.0.0:4000',
  changeOrigin: false,
  ws: true
})

app.use(wsProxy)
app.listen(port)
app.on('upgrade', wsProxy.upgrade)

if(process.env.NODE_ENV !== 'local_production_test') {
  https.createServer(options, app).listen(443)
}

console.log('Why hello there')
