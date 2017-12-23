// Prod server for Digital Ocean

let express = require('express')
let app = express()
let port = 80

app.use('/dist', express.static('dist'))
app.use(express.static(__dirname + '/dist'))
app.listen(port)