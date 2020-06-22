const express=require('express')
const Story = require('../models/story')
const multer=require('multer')
const sharp=require('sharp')
const { json } = require('express')
const router= new express.Router()

//Customizing what kind of image should be uploaded
const upload=multer({
    limits:{
        fileSize:4000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpeg|jpg|png|JPG)$/))
        {
            return cb(new Error('Please upload a jpeg/jpg/png file'))
        }
        cb(undefined,true)

    }

})


//uploading an image
router.post('/instagram/image',upload.array('story',2),async (req,res)=>{
    try{
    const story=new Story()
    const count=req.query.count  //query string that allows user to decide how many images he/she want to upload
    const bufferimgs=req.files //getting the pictures so that we can access them 
    for(var i=0;i<count;i++) //saving them in database
        {   
            story.pics=story.pics.concat({pic:await sharp(bufferimgs[i].buffer).jpeg().toBuffer()})
        }
    const cap=(req.body.Caption) //if you want to upload caption you can
    story.Caption=cap
    await story.save()  //saving the story
    res.status(200).send(story)
    }catch(e){
        res.status(404).send({error:'something went wrong'})
    }
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})



//Commenting on a story
router.patch('/instagram/comment/:id',async(req,res)=>{
    try{
    const story=await Story.findById(req.params.id) //finding story
    const comment=Object.keys(req.body) //checking whether the user is Commenting corectly
    const isValidComment=(comment=="Comment")
    if(!isValidComment)
    {
        res.status(400).send({error:'Please enter valid comment(check Comment spelling)'})
    }
    const Comment=req.body.Comment 
    story.Comments=story.Comments.concat({Comment}) //finally adding the comment
    await story.save()  //saving the updated story with comment
    res.status(200).send(req.body.Comment)
    }catch(e){
        res.status(400).send({error:'Something went wrong'})
    }
})


//See your story with comments
router.get('/instagram/story/:id',async(req,res)=>{
    try{
    const story=await Story.findById(req.params.id)
    if(!story){
        res.status(404).send({error:'Story not found'})
        
    }
    res.send(story)
    }catch(e){
        res.status(400).send({error:'Something went wrong'})
    }
})


//query string :- pageno set this to greater than 0 (eg:- localhost:3000/instagram/allstory?pageno=1)
router.get('/instagram/allstory',async(req,res)=>{
    var pageno=parseInt(req.query.pageno)
    //applied pagination
    var query={
        limit:4,
        skip:4*(pageno-1)
     }
    try{
        await Story.find({},{},query,(err,data)=>{
            if(err)
            {
                res.status(404).send({error:'page not found'})
            }
            else{
                res.status(200).send(data)
            }
        })
       
     }catch(e){
         res.status(500).send(e)
 
     }
})

module.exports=router