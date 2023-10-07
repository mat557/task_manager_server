const express = require('express')
const app = express()
require('dotenv').config()
const http = require('http')
const cors = require('cors')
const allowedOrigin = require('./config/allowedOrigin')
const { connectToServer } = require('./utils/dbConnects')
const cookieParser = require('cookie-parser')
const port = 7000 || process.env.PORT
const authRoute = require('./routes/authRoutes')
const userRoute = require('./routes/userRoute')
const taskManager = require('./routes/taskManager')
const chatRoute = require('./routes/chatRoutes')
const initSocket = require('./utils/initSocket')


const server = http.createServer(app)

app.use(cors(allowedOrigin))
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(cookieParser())


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
app.use('/message', chatRoute)


initSocket(server)


app.all('*', async(req,res) =>{
    res.status(404).json({ message: "Cann't find the requested route!" })
})

app.get(port, (req,res) => {
    res.status(204).json({message:`Server responded successfully!`})
})