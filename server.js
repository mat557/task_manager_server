const express = require('express')
const app = express()
require('dotenv').config();
const cors = require('cors')
const allowedOrigin = require('./config/allowedOrigin');
const { connectToServer } = require('./utils/dbConnects');
const port = 7000 || process.env.PORT
const authRoute = require('./routes/authRoutes')
const userRoute = require('./routes/userRoute')
const taskManager = require('./routes/taskManager')



app.use(cors(allowedOrigin))

app.use(express.urlencoded({ extended: true }));
app.use(express.json())


connectToServer()
    .then(() => {
        app.listen(port, () => {
        console.log(`Server is running at port: ${port}`);
        });
    })
    .catch((err) => {
        console.error('Error connecting to the database:', err);
    });



app.use('/auth', authRoute)
app.use('/user', userRoute)
app.use('/task', taskManager)



app.all('*', async(req,res) =>{
    res.status(404).json({ message: "Cann't find the requested route!" })
})

app.get(port, (req,res) => {
    res.status(204).json({message:`Server responded successfully!`})
})