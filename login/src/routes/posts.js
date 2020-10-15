const express = require('express')
const router = express.Router()
const postController = require('../controller/posts')

router.post('/createPost', postController.createPost)
router.post('/getPosts', postController.getPosts)

module.exports = router