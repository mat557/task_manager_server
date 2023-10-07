const jwt = require('jsonwebtoken');
const { getDb } = require("../utils/dbConnects")
const bcrypt = require('bcrypt');




const getSingleUser = async(req,res) =>{
    try{
        const db = getDb()
        const email = req.params.email

        const query = { email: email}
        const user = await db.collection('users').findOne(query)

        if(!user){
            return res.status(404).json({
                user,
                 message: 'Invalid username' 
            })
        }

        res.status(200).json({
            user,
            message: 'User found successfully'
        })

    }catch(err){
        console.log(err)
    }
}


const getSingleUserByToken = async(req,res) =>{
    try{
        const db = getDb()
        const token = req.params.token

        if(token == null){
            return res.status(403).json({
                message : 'Please login or create an account!'
            })
        }


        var decoded;

        try {
            decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        } catch (err) {
            console.error(err);
            return res.status(401).json({
                message: 'Invalid token'
            });
        }


        const query = { email: decoded.data.email}
        const options = {
            projection: { password: 0 }
        }

        const user = await db.collection('users').findOne(query,options)
        
        const jwt_user_data = {
            email: user.email,
            roles: user.roles ||  []
        }

        const access_token = jwt.sign({
            data: jwt_user_data
          }, process.env.ACCESS_TOKEN_SECRET, 
          { expiresIn: '1h' }
        );

        res.status(200).json({
            user,
            access_token
        })

    }catch(err){
        console.log(err)
    }
}


const getAllleUser = async(req,res) =>{
    try{
        const db = getDb()
        const user = await db.collection('users').find().toArray()

        if(!user.length){
            return res.status(400).json({
                user,
                message: 'No user found!'
            })
        }

        res.status(200).json({
            user,
            message: 'Users found successfully!'
        })

    }catch(err){
        console.log(err)
    }
}



const updateUserControllers = async(req,res) =>{
    try{
        const db = getDb()
        const { email , name , number , roles , status , password } = req.body

        let hashedPass
        if(password.length){
            const saltRounds = 10;
            hashedPass = await bcrypt.hash( password , saltRounds )
        }
        

        const query = { email : email }

        const user = await db.collection('users').findOne(query)
        if(!user){
            return res.status(403).json({
                message : 'No user found',
            })
        }

        const options = { upsert: true };

        let setStatus

        if(status !== user.status){
            setStatus = status
        }else{
            setStatus = user.status
        }


        const updateDoc = {
            $set: {
                email : email,
                password: password ? hashedPass : user.password,
                number : number ? number : user.number,
                roles : roles ? roles : user.roles,
                name : name ? name : user.name,
                status : setStatus
            },
        };

        const result = await db.collection('users').updateOne(query, updateDoc, options);
        

        res.status(200).json(result)

    }catch(err){
        console.log(err)
    }
}



const deleteUserControllers = async(req,res) =>{
    try{
        const db = getDb()
        const { email } = req.body

        const query = { email : email }

        const delete_response = await db.collection('users').deleteOne(query)

        res.status(200).json(delete_response)

    }catch(err){
        console.log(err)
    }
}



module.exports = {
    getSingleUser,
    getSingleUserByToken,
    getAllleUser,
    updateUserControllers,
    deleteUserControllers
}