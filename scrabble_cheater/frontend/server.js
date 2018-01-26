
let express = require('express')
let proxy = require('http-proxy-middleware')
let app = express()
let https = require('https')
let fs = require('fs')
let port = 80

// Run from terminal: 
// `NODE_ENV=local_production_test npm run serve`
// Use `yarn dev` server for developing: this is to make sure production build works locally
if(process.env.NODE_ENV === 'local_production_test') {
  port = 3000
}

const sslPath = '/etc/letsencrypt/live/www.wordswithfiends.com/'
const options = {
    key: fs.readFileSync(sslPath + 'privkey.pem'),
    cert: fs.readFileSync(sslPath + 'fullchain.pem')
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
let server = https.createServer(options, app).listen(443)


console.log('R U N N I N G')
