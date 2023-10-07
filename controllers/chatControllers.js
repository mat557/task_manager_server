const { getDb } = require("../utils/dbConnects")
const {format} = require('date-fns');

const getMessage = async (req,res) => {
    try{
        const db = getDb()
        const today =format(new Date(),'dd.MM.yyyy');
        const { uId , message } = req.body

        if(!uId || !message){
            return res.status(403).json({
                message : 'No empty field allowed!'
            })
        }

        const msgObject = {
            senderID : uId,
            message  : message,
            insertion: today
        }

        const result = await db.collectio('message').insertOne(msgObject)
        
        console.log(result)

        res.status(200).json({
            message: 'Message inserted successfully',
            result: result.ops[0], // Send the inserted message
        });

    }catch(err){
        console.log(err)
    }
}


const sendMessage = async (req,res) => {
    try{
        const db = getDb()
        const today =format(new Date(),'dd.MM.yyyy');
        const { uId , message } = req.body

        if(!uId || !message){
            return res.status(403).json({
                message : 'No empty field allowed!'
            })
        }

        const msgObject = {
            senderID : uId,
            message  : message,
            insertion: today
        }

        const result = await db.collectio('message').insertOne(msgObject)
        
        console.log(result)

        res.status(200).json({
            message: 'Message inserted successfully',
            result: result.ops[0], // Send the inserted message
        });

    }catch(err){
        console.log(err)
    }
}

module.exports = {
    getMessage,
    sendMessage
}