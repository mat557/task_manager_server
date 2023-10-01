const { ObjectId } = require("mongodb");
const { getDb } = require("../utils/dbConnects");
const {format} = require('date-fns');



const getSingleTask = async(req,res) =>{
    try{
        const db = getDb()
        const id = req.params.id

        const query = new ObjectId(id)
        const task = await db.collection('tasks').findOne(query)

        if(!task){
            return res.status(404).json({
                user,
                message: 'Invalid id or no task exist' 
            })
        }

        res.status(200).json({
            user,
            message: 'Task found successfully'
        })

    }catch(err){
        console.log(err)
    }
}



const getAllTask = async(req,res) =>{
    try{
        const db = getDb()
        const task = await db.collection('tasks').find().toArray()

        if(!task.length){
            return res.status(400).json({
                user,
                message: 'No task found!'
            })
        }

        res.status(200).json({
            user,
            message: 'Tasks found successfully!'
        })
    }catch(err){
        console.log(err)
    }
}


const createTask = async(req,res) =>{
    try{
        const db = getDb()
        const { creator , task_desc , deadline , assigned_to , creator_role , task_type } = req.body

        
        if( !creator || !task_desc || !deadline || !assigned_to || !creator_role || !task_type){
            return res.status(400).json({
                message: 'No empty field allowed!'
            })
        }

        const query = { email: assigned_to}
        const user = await db.collection('users').findOne(query)

        if(!user.status){
            return res.status(400).json({
                message: `User named "${user.username} with email- ${assigned_to} is not active at the moment!"`,
                additional: `Please try a different employee` 
            })
        }

        const date = new Date();

        const new_task = {
            creation_date: `${format(date, 'dd.MM.yyyy')}`,
            deadline: deadline,
            creator: creator,
            creator_role: creator_role,
            description : task_desc,
            assigned_to : assigned_to,
            task_type: task_type,
            isFinished : false,
            isAccepted : flase 
        }

        const response = await db.collection('tasks').insertOne(new_task)

        res.status(200).json({ 
            response , 
            message: 'Task added succesffully!'
        })

    }catch(err){
        console.log(err)
    }
}

const updateTask = async(req,res) =>{
    try{
        const db = getDb()
        const { id , creator , task_desc , deadline , assigned_to , creator_role , isFinished , task_type , isAccepted } = req.body

        
        const query = {_id :new ObjectId(id)}

        const isMatched = await db.collection('tasks').findOne(query)
        const date = new Date()

        let acceptParameter
        if(isAccepted === true){
            acceptParameter = true
        }else{
            acceptParameter= false
        }

        let finishtParameter
        if(isFinished === true){
            finishtParameter = true
        }else{
            finishtParameter = false
        }

        const updateDoc = {
            $set: {
                creator : creator? creator : isMatched.creator,
                creator_role : creator_role ? creator_role : isMatched.creator_role,
                task_desc: task_desc ? task_desc : isMatched.task_desc,
                deadline : deadline ? deadline : isMatched.deadline,
                creation_date:`${format(date, 'dd.MM.yyyy')}`,
                assigned_to : assigned_to ? assigned_to : isMatched.assigned_to,
                task_type : task_type ? task_type : isMatched.task_type,
                isFinished : finishtParameter,
                isAccepted : acceptParameter
            },
        };

        const options = {
            upsert: true
        }
 
        const result = await db.collection('tasks').updateOne(query, updateDoc, options);
        
        res.status(200).json({
            result,
            message: 'Task updateed successfully.'
        })
    }catch(err){
        console.log(err)
    }
}

const deleteTask = async(req,res) =>{
    try{
        const db = getDb()
        const id = req.params.id

        const query = { _id : ObjectId(id)}

        const task = await db.collection('tasks').findOne(query)

        if(!task){
            return res.status(404).json({
                user,
                message: 'Invalid id or no task exist to delete' 
            })
        }

        const delete_response = await db.collection('task').deleteOne(query)

        res.status(200).json({
            delete_response,
            message: 'Delete successfull.'
        })
    }catch(err){
        console.log(err)
    }
}


//patch request to update
const assignTask = async(req,res) =>{
    try{
        const db = getDb()
        const { id , isAccepted } = req.body

        if( !id || !Boolean(isAccepted) ){
            return res.status(403).json({
                message : 'Invalid task id or acquired field is empty'
            })
        }

        const query = { _id : ObjectId(id)}
        const task = await db.collection('tasks').findOne(query)

        if( !task ){
            return res.status(403).json({
                message : 'No task found!'
            })
        }

        if( isAccepted === task.isAccepted ){
            return res.status(403).json({
                message : 'You are not changing anything!'
            })
        }


        const updateDoc = { 
            $set: { 
                isAccepted :  isAccepted
            } 
        }
        const option = { returnOriginal: false }

        const checker = await db.collection('tasks').findOneAndUpdate(query,updateDoc,option)
        
        res.status(200).json({
            checker,
            message: isAccepted === true ? 'Task acquired!' : 'Task removed!'
        })
    }catch(err){
        console.log(err)
    }
}


module.exports = {
    getAllTask,
    createTask,
    updateTask,
    getSingleTask,
    deleteTask,
    assignTask
}