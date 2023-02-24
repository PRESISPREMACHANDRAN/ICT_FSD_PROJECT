//requirements by admin
var Mongoose=require('mongoose');

const requirementSchema=Mongoose.Schema(
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



var RequirementModel=Mongoose.model('Requirements',requirementSchema);


module.exports={RequirementModel};