let express = require('express')
var proxy = require('http-proxy-middleware')
let app = express()
let port = 80

// NODE_ENV=local npm run server
console.log('process.env.NODE_ENV', process.env.NODE_ENV);
if(process.env.NODE_ENV === 'local') {
  port = 3000
}


app.use('/dist', express.static('dist'))
app.use(express.static(__dirname + '/dist'))

var wsProxy = proxy('/', {
  target: 'http://0.0.0.0:4000',
    pathRewrite: {
     // '^/socket.io' : '/asdasd',        // rewrite path.
   //  '^/removepath' : ''               // remove path.
    },
  changeOrigin: false,                     // for vhosted sites, changes host header to match to target's host
  ws: true,                               // enable websocket proxy
  logLevel: 'debug'
})

app.use(wsProxy)
var server = app.listen(port)
server.on('upgrade', wsProxy.upgrade)