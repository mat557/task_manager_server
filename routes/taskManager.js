const express = require('express')
const router = require('express').Router()
const task_managerControllers = require('../controllers/taskManagerControllers')



router.route('/find/:id').get(task_managerControllers.getSingleTask)
router.route('/get/all').get(task_managerControllers.getAllTask)


router.route('/create').put(task_managerControllers.createTask)

router.route('/update').patch(task_managerControllers.updateTask)
router.route('/recieved').patch(task_managerControllers.recieveConfirmation)

router.route('/delete/:id').delete(task_managerControllers.deleteTask)

module.exports = router