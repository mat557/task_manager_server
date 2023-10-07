const express = require('express')
const router = require('express').Router()
const authControllers = require('../controllers/authControllers')



//for creating an user and also send jwt token
router.route('/new').put(authControllers.createUserController)

// for logging/logout in purpose and also send jwt token
router.route('/login').post(authControllers.loginUserControllers)
router.route('/logout').post(authControllers.logoutUserControllers)



    

module.exports = router