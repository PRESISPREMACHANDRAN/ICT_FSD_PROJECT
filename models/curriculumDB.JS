//requirements by admin
var Mongoose=require('mongoose');

const finalSchema=Mongoose.Schema(
    {
        ReqName:{
            type:String,
            required:true  
        },
        trainingArea:{
            type:String,
            required:true
        },
        reqCategory:{
            type:String,
            required:true 
        },
        institution:{
            type:String,
            required:true 
        },
        duration:{
            type:Number,
            required:true 
        }
    }
);



var curriculumModel=Mongoose.model(' curriculumModel',finalSchema);


module.exports={curriculumModel};