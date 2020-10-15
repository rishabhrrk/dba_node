require('dotenv').config()

const express = require('express')
const app = express()
const posts = require('./src/routes/posts')
const db = require('./src/utils/db/db')

async function initialize(){
    // app.use(cors())
    app.use(express.json())
    app.use('/',posts)
    db.connect()
    app.listen(5002,() => {
        console.log(`app running on 5002`)
    })
}

initialize()
// app.post('/newUser', (req, res) => {
//     const newUser = new User(req.body['userData'])
//     newUser.save((error) => {
//         if(error){
//             res.status(500).send(`Error with Mongo ${error}`)
//         }else{
//             res.status(201).send(`Ho gya`)
//         }
//     })
// })

// app.post('/getUser', (req, res) => {
//     User.findOne({'username': `${req.body['username']}`}, (err, data) => {
//         if(err){
//             res.status(500).send(`Error madarchod`)
//         }else{
//             res.status(201).send(data)
//         }
//     })
// })