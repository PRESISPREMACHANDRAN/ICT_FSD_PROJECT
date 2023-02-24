//Create a schema for the uploaded reference file

var Mongoose=require('mongoose');

const fileSchema = new Mongoose.Schema({
    name: {
    type: String,
    // required: true
    },
    data: {
    type: Buffer,
    // required: true
    }
});

//Create a model for the uploaded file
const CurriculumFaculty= Mongoose.model('CurriculumFaculty', fileSchema);


module.exports = {CurriculumFaculty};