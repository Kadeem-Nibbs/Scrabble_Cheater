let express = require('express')
var proxy = require('http-proxy-middleware')
let app = express()
let port = 80

// Run from terminal: 
// `NODE_ENV=development npm run serve`
// Use `yarn dev` server for developing: this is to make sure production build works locally
if(process.env.NODE_ENV === 'development') {
  port = 3000
}

app.use('/dist', express.static('dist'))
app.use(express.static(__dirname + '/dist'))

var wsProxy = proxy('/', {
  target: 'http://0.0.0.0:4000',
  changeOrigin: false,
  ws: true
})

app.use(wsProxy)
var server = app.listen(port)
server.on('upgrade', wsProxy.upgrade)