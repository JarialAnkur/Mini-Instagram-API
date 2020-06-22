const express=require('express')
require('./db/mongoose')
const Storyrouter=require('./Routes/storyroute')


const app=express()

app.use(express.json())
app.use(Storyrouter)

const port=process.env.PORT||3000

app.listen(port,()=>{
    console.log('Server is running successfully on '+port)
})