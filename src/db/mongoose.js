const mongoose = require('mongoose')
// const user = require('./models/user')

const connectionURL = 'mongodb://127.0.0.1:27017/user-database'
// const database = ''
mongoose.set("strictQuery", false);
mongoose.connect(connectionURL,{ useNewUrlParser: true },(error,client) => {
    console.log(`MongoDB connected : ${connectionURL}`);
    if(error) {
        return console.log('Unable to connect database')
    }
})