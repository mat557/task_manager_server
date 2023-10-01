const express = require('express')
const router = require('express').Router()
const task_managerControllers = require('../controllers/taskManagerControllers')



router.route('/create/:id').get(task_managerControllers.getSingleTask)


router.route('/create').put(task_managerControllers.createTask)
router.route('/get').get(task_managerControllers.getAllTask)
router.route('/update').patch(task_managerControllers.updateTask)
router.route('/delete').delete(task_managerControllers.deleteTask)

module.exports = router