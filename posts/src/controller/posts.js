const express = require('express')
const app = express()
const postService = require('../service/posts')

async function create(req, res){
    try{
        var postObj = req.body
        // delete postObj['refreshToken']
        // delete postObj['accessToken']
        var post = await postService.create(postObj)
        if(post){
            res.status(200).json({
                success: true,
                statusCode: 'CREATE_POST_SUCCESS',
                message: 'Post Created'
            })
        }else{
            throw new Error(`Problem with Post Create Service`)
        }
    }catch(err){
        res.status(400).json({
            success: false,
            statusCode: 'CREATE_POST_FAILURE',
            message: err
        })
    }
}

async function getPost(req, res){
    try{
        var postObj = req.body
        // delete postObj['refreshToken']
        // delete postObj['accessToken']
        var posts = await postService.getPost(postObj)
        if(posts){
            res.status(200).send(posts)
        }else{
            throw new Error(`Problem with Post Create Service`)
        }
    }catch(err){
        res.status(400).json({
            success: false,
            statusCode: 'GET_POST_FAILURE',
            message: err
        })
    }
}

module.exports = { create, getPost }