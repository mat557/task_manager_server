const express = require('express')
const router = require('express').Router()
const userControllers = require('../controllers/userControllers')



//get all user

router.route('/:email')
    .get(userControllers.getSingleUser)


router.route('/refresh/:token')
        .get(userControllers.getSingleUserByToken)
    




router.route('/action')
        .get(userControllers.getAllleUser) //get all user
        .patch(userControllers.updateUserControllers) //update user profile
        .delete(userControllers.deleteUserControllers) //delete an user also token is removed





module.exports = router