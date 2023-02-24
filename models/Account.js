const Mongoose = require("mongoose");
const schema = Mongoose.Schema;

const accountSchema = new schema({
    serName : String,
    designation : String,
    employeeId : Number,
    emailAddress : String,
    password : String


});

const accountModel = Mongoose.model("Accounts", accountSchema); 
module.exports = accountModel;



