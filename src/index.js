const express = require('express')
var bodyParser = require('body-parser')
require('./db/mongoose')
const cors = require('cors');

var app = express()

const userRoute = require('./routes/userRoutes')

app.use(cors());
app.use(bodyParser.json({limit:'50mb'}));
app.use(express.json())
app.use(userRoute)

app.listen(3002, () => {
    console.log('Running at 3002')
})