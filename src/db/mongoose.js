const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://TaskManagerDB:Task@123456@cluster0-an0ha.mongodb.net/instagram?retryWrites=true', {
    useNewUrlParser: true,
    useCreateIndex:true,
    useFindAndModify:false,
    useUnifiedTopology:true
})