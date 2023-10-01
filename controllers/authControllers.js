const { getDb } = require("../utils/dbConnects");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const createUserController = async (req,res) =>{
    try{
        const db = getDb()
        const email = req.params.email;

        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            return res.status(400).json({
              message: 'Invalid email format!',
            });
        }

        const query = { email : email }
        const options = {
            projection: { email : 1 }
        }

        const match = await db.collection('users').findOne(query,options)


        if(match){
            return res.status(404).json({ 
                message : `User with email ${match.email} exist already. Please login`
            })
        }

        const { name , password , number } = req.body
        
        if(!name || !password || !number){
            return res.status(404).json({ 
                message: 'No missing field allowed!'
            })
        }


        const saltRounds = 10;
        const hashedPass = await bcrypt.hash( password , saltRounds )

        
        const user_doc = {
            email : email,
            name : name,
            password: hashedPass,
            number : number,
            roles : [],
            status: Boolean
        }

        const jwt_user_data = {
            email:email,
            roles: []
        }

        const access_token = jwt.sign({
            data: jwt_user_data
          }, process.env.ACCESS_TOKEN_SECRET, 
          { expiresIn: '1h' }
        );

        
        const response = await db.collection('users').insertOne(user_doc)
        
        res.cookie('token',
            access_token,
        { 
            maxAge: 900000, 
            httpOnly: true ,
            sameSite: 'None', 
            secure: true
        })

        res.status(200).json({ 
            response , 
            // access_token
        })
        
    }catch(err){
        console.log(err)
    }
}



const loginUserControllers = async (req,res) =>{
    try{
        const db = getDb()
        const { email , password } = req.body

        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            return res.status(400).json({
              message: 'Invalid email format!',
            });
        }

        const query = { email : email }
        const user = await db.collection('users').findOne(query)
        

        if(email !== user.email){
            return res.status(403).json({
                message: 'Invaid email or password!',
                suggest : 'Please try again or create account.'
            })
        }

        const matched = await bcrypt.compare(password, user.password)

        if(!matched){
            return res.status(403).json({ 
                message : 'Invalid username or password!',
                suggest : 'Please try again or create account.'
            })
        }

        const jwt_user_data = {
            email:email,
            roles: user.roles
        }

        const access_token = jwt.sign({
            data: jwt_user_data
          }, process.env.ACCESS_TOKEN_SECRET, 
          { expiresIn: '1h' }
        );


        res.cookie('token',
            access_token,
        { 
            maxAge: 900000, 
            httpOnly: true ,
            sameSite: 'None', 
            secure: true
        })
        
        res.status(200).json({
            message: 'User found!',
            additional : 'Login successfull',
            // access_token
        })

    }catch(err){
        console.log(err)
    }
}




const logoutUserControllers = async(req,res) =>{
    try{

        res.clearCookie('token', { 
            httpOnly: true, 
            sameSite: 'None', 
            secure: true 
        })

        res.json({ 
            message: 'Cookie cleared', 
            additional: 'Process successfull' 
        })


    }catch(err){
        console.log(err)
    }
}


module.exports = {
    createUserController,
    loginUserControllers,
    logoutUserControllers
}