const express = require('express')
const router = require('express').Router()
const chatControllers = require('../controllers/chatControllers')

router.route('/message/recieve').post(chatControllers.getMessage)

router.route('/message/send').post(chatControllers.sendMessage)


module.exports = router