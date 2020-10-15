require('dotenv').config()
const mongoose = require('mongoose')

async function connect(config=null){
    var dbURL = null
    if(config){
        dbURL = `${config.url}:${config.port}/${config.name}`
    }
    mongoose.connect(process.env.DB_URL || dbURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    mongoose.connection.on('error', (err) => {
        console.log(err.stack)
    })
    mongoose.connection.on('open', function callback() {
        console.log(`DB up and running ... ${process.env.DB_URL || config.url}`)
    })
}

module.exports = { connect, }