require('dotenv').config()

const express = require('express')
let router = express.Router()
const userController = require('../controller/user')

router.post('/signup', userController.signup)

router.post('/authenticate', userController.authenticate)

router.post('/login', userController.login)

router.delete('/logout', userController.logout)

module.exports = router