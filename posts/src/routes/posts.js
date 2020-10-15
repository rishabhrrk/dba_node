const express = require('express')
const router = express.Router()
const postController = require('../controller/posts')

router.post('/create', postController.create)
router.post('/getPosts', postController.getPost)

module.exports = router