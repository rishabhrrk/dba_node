const serviceUser = require('../service/user')
const logger = require('../utils/logger')

async function signup(req, res){
    try{
        let user = await serviceUser.signup(req.body)
        if(user){
            res.status(200).json({
                success: true,
                statusCode: 'CREATE_USER_SUCCESS',
                message: 'Successfully created user',
                user
            })
        }else{
            throw new Error(`User couldn't be created`)
        }  
    }catch(err){
        logger.error(err.stack)
        res.status(400).json({
            success: false,
            statusCode: 'CREATE_USER_FAILURE',
            message: err.message || err.errors || err.errmsg
        })
    }
}

async function login(req, res){
    try{
        const user = await serviceUser.login(req.body)
        if(user){
            res.status(200).json({
                success: true,
                statusCode: 'SUCCESS_LOGIN',
                message: 'Login Successful',
                user
            })
        }else{
            throw new Error(`Credentials Don't match`)
        }
    }catch(err){
        logger.error(err.stack)
        res.status(400).json({
            success: false,
            statusCode: 'FAILURE_LOGIN',
            message: err.message || err.errors || err.errmsg
        })
    }
}

function logout(req, res){
    try{
        let user = serviceUser.logout(req.body)
        res.status(200).json({
            success: true,
            statusCode: 'SUCCESS_LOGOUT',
            message: 'Successfully Logged Out',
            user
        })
    }catch(err){
        logger.error(err.stack)
        res.status(400).json({
            success: false,
            statusCode: 'FAILURE_LOGOUT',
            message: err.message || err.errors || err.errmsg
        })
    }
}

async function authenticate(req, res){
    try{
        let user = await serviceUser.authenticate(req.body)
        if(user){
            res.status(200).json({
                success: true,
                statusCode: 'SUCCESS_AUTHENTICATE',
                message: 'Successfully Authenticated',
                user
            })
        }else{
            throw new Error(`Token doesn't match`)
        }
    }catch(err){
        logger.error(err.stack)
        res.status(400).json({
            success: false,
            statusCode: 'FAILURE_AUTHENTICATE',
            message: err.message || err.errors || err.errmsg
        })
    }
}

module.exports = { login, logout, signup, authenticate }