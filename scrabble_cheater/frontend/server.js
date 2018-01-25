let express = require('express')
let proxy = require('http-proxy-middleware')
let app = express()
let port = 80

// Run from terminal: 
// `NODE_ENV=local_production_test npm run serve`
// Use `yarn dev` server for developing: this is to make sure production build works locally
if(process.env.NODE_ENV === 'local_production_test') {
  port = 3000
}

app.use('/dist', express.static('dist'))
app.use(express.static(__dirname + '/dist'))

let wsProxy = proxy('/', {
  target: 'http://0.0.0.0:4000',
  changeOrigin: false,
  ws: true
})

app.use(wsProxy)
let server = app.listen(port)
server.on('upgrade', wsProxy.upgrade)