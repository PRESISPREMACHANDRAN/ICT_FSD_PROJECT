//reference file by admin
//Create a schema for the uploaded reference file

var Mongoose=require('mongoose');

const fileSchema = new Mongoose.Schema({
    name: {
    type: String,
    required: true
    },
    data: {
    type: Buffer,
    required: true
    }

  
});

//Create a model for the uploaded file
const refFileModel = Mongoose.model('refFileModel', fileSchema);


module.exports = {refFileModel};


