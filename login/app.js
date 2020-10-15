require('dotenv').config()

const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const user_auth = require('./src/routes/user_auth')
const posts = require('./src/routes/posts')
const db = require('./src/utils/db/db')
const serviceUser = require('./src/service/user')

async function initialize(){
    app.use(express.json())
    app.use(authenticateToken)
    app.use('/user', user_auth)
    app.use('/posts', posts)
    db.connect()
    app.listen(5001, () => {
        console.log('Listening on port 5001')
    })
}

initialize()

function authenticateToken(req, res, next){
    try{
        if(req.headers['authorization'] == undefined){
            if(req.body['username'] && req.body['password']){
                serviceUser.login(req.body)
                .then((r) => next())
                .catch((err) => {throw new Error(err)})
            }else{
                throw new Error(`Missing User credentials`)
            }
        }else if(req.body['refreshToken'] != undefined){
            next()
        }else{
            const authHeader = req.headers['authorization']
            const token = authHeader && authHeader.split(' ')[0]
            if(token == null) return res.sendStatus(401)
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, verified) => {
                if(err){
                    throw new Error(`Token expired`)
                }else{
                    next()
                }
            })
        }
    }catch(error){
        console.log(error)
        res.status(403).send(`Not authorized ${error}`)
    }
}

// function authenticateToken(req, res, next){
//     try{
//         if(req.headers['authorization'] == undefined){
//             if(req.body['username'] && req.body['password']){
//                 serviceUser.login(req.body)
//                 .then((r) => {
//                     next()
//                 }, (e) => {
//                     console.log(e)
//                     throw new Error('Not authenticated')
//                 })
//                 .catch((err) => {
//                     throw new Error('Not authenticated')
//                 })
//             }
//         }else{
//             const authHeader = req.headers['authorization']
//             const token = authHeader && authHeader.split(' ')[0]
//             if(token == null) return res.sendStatus(401)
//             jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err, response) => {
//                 if(err){
//                     serviceUser.authenticate(req.body)
//                     .then((r1) => {
//                         next()
//                     })
//                     .catch((e)=> {
//                         console.log(`${e}`)
//                     })
//                 }else{
//                     next()
//                 }
//             })
//         }
//     }catch(err){
//         console.log(`${err}`)
//     }
// }