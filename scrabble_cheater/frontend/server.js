let express = require('express')
let app = express()
let port = process.env.PORT || 3000 // need to make .env file

app.use('/dist', express.static('dist'))

app.use(express.static(__dirname + '/dist'))
app.listen(port)