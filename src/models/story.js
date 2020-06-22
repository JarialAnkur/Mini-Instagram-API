const mongoose=require('mongoose')

//Creating Story Model
const userSchema=mongoose.Schema({
    pics:[{
      pic:{  
        type:Buffer,
        required:true
      }
    }],
    Caption:{
        type:String,
        trim:true
    },
    Comments:[{
        Comment:
        {
        type:String,
        trim:true
        }
       
    }],

}, {
    timestamps:true
})

//Putting toJson Function to control what we get as output
userSchema.methods.toJSON=function(){
    const story=this
    const storyObject=story.toObject()
    

    
    delete storyObject.__v
    delete storyObject.pics
    
    
    return storyObject
}


const Story=mongoose.model('Story',userSchema) //Finalizing the model using mongoose

module.exports=Story