

var Mongoose=require('mongoose');

const currFileSchema = new Mongoose.Schema({
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
const currFileModel = Mongoose.model('currFileModel',currFileSchema);


module.exports = {currFileModel};