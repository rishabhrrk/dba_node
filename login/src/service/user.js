const db = require('../utils/db/db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { promisify } = require('util')

class UserService{
    async signup(user){
        try{
            const hashedPassword = await bcrypt.hash(user['password'],10)
            db.client.set(user['username'], hashedPassword)
            return true
        } catch(error){
            console.log(`Error occured at Service signup : ${err}`)
        }
    }

    async login(user){
        try{
            const getAsync = promisify(db.client.get).bind(db.client)
            return getAsync(user['username'])
            .then((encryptedPassword) => {
                if(!encryptedPassword) throw new Error(err)
                return bcrypt.compare(user['password'], encryptedPassword)
            })
            .then((match) => {
                if(match){
                    const accessToken = jwt.sign({'username': user['username']}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '40s'})
                    const refreshToken = jwt.sign({'username': user['username']}, process.env.ACCESS_TOKEN_REFRESH)
                    db.client.SADD('refreshTokenCollection',refreshToken)
                    user['accessToken'] = accessToken
                    user['refreshToken'] = refreshToken
                    return user
                }else{
                    throw new Error(`User Credentials don't match`)
                }
            })
            .catch(err => {
                console.log(`Error occured at Service login : ${err}`)
            })
        }catch(err){
            console.log(`Error occured at Service login : ${err}`)
        }
    }

    logout(user){
        try{
            if(!user['refreshToken']) throw new Error(`No refresh token`)
            db.client.SREM('refreshTokenCollection', user['refreshToken'])
            user['refreshToken'] = ""
            user['accessToken'] = ""
            return user
        }catch(err){
            console.log(`Error occured at Service logout : ${err}`)
        }
    }

    async authenticate(user){
        try{
            if(!user['refreshToken']) throw new Error(`403: Forbidden`)
            const getAsync = promisify(db.client.SISMEMBER).bind(db.client)
            return getAsync('refreshTokenCollection',user['refreshToken'])
            .then((match) => {
                if(match == 0) throw new Error (`Token doesn't exist`)
                return jwt.verify(user['refreshToken'], process.env.ACCESS_TOKEN_REFRESH)
            })
            .then((verified) => {
                if(verified){
                    const accessToken = jwt.sign({'username': user['username']}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '40s'})
                    user['accessToken'] = accessToken
                    return user
                }else{
                    throw new Error(`Couldn't verify`)
                }
            })
            .catch(e => console.log(`error ${e}`))
        }catch(err){
            console.log(`is it here${err}`)
        }
    }
}

module.exports = new UserService()