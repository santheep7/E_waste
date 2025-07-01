const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const userRoute = require('./router/UserRoute')
const Reqrouter = require('./router/RequestRouter')
const AdminRoute = require('./router/AdminRouter')
const AgentRoute = require('./router/AgentRouter')
const router=require('./router/chatRouter')
const msgRoute = require('./router/messageRouter')
const app = express()
app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(express.json())
require('dotenv').config()

app.use('/uploads',express.static('uploads'))
// connection code
const dbconnect = async()=>{
    try{
        await mongoose.connect(process.env.database_conn)
        console.log("Database connected successfully")
    }catch(error){
        console.log("Database connection error",error)
    }
}
dbconnect()
app.use('/api/user',userRoute)
app.use('/api/req',Reqrouter)
app.use('/api/admin',AdminRoute)
app.use('/api/agent',AgentRoute)
app.use('/api/chat',router)
app.use('/api/msg',msgRoute)
// port
app.listen(9000,()=>{
    console.log("Server running on Port:9000 succesfully")
})