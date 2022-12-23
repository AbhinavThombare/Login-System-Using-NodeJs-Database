const express = require('express')
require('./db/mongoose')
const cors = require('cors');

var app = express()

const userRoute = require('./routes/userRoutes')

app.use(cors());

app.use(express.json())
app.use(userRoute)

app.listen(3002, () => {
    console.log('Running at 3002')
})