// Prod server for Digital Ocean

let express = require('express')
var proxy = require('http-proxy-middleware')
let app = express()
let port = 80

if(process.env.NODE_ENV === 'local') {
  port = 3000
}


app.use('/dist', express.static('dist'))
app.use(express.static(__dirname + '/dist'))

var wsProxy = proxy('ws://www.wordswithfiends.com:4000', { changeOrigin:true })
app.use(wsProxy)
var server = app.listen(port)
server.on('upgrade', wsProxy.upgrade)
