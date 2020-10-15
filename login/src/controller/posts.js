require('dotenv').config()
const axios = require('axios')

async function createPost(req, res){
    try{
        axios.post(process.env.POST_SERVICE_URL+'/create', req.body)
        .then((result) => {
            res.status(200).json({
                success: true,
                statusCode: 'SUCCESS_CREATE_POST',
                message: `Post is created ${result.data}`
            })
        })
        .catch((err) => {throw new Error(`${err}`)})
    }catch(error){
        res.status(400).json({
            success: false,
            statusCode: 'FAILURE_CREATE_POST',
            message: `Post is not created ${error}`
        })
    }
}

async function getPosts(req, res){
    try{
        axios.post(process.env.POST_SERVICE_URL+'/getPosts', req.body)
        .then((result) => {
            res.status(200).json(result.data)
        })
        .catch((err) => {
            throw new Error(`${err}`)
        })
    }catch(error){
        res.status(400).json({
            success: false,
            statusCode: 'FAILURE_GETTING_POST',
            message: `${error}`
        })
    }
}

module.exports = { createPost, getPosts }