const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    firstname : String, 
    lastname : String,
    email : String,
    password : String, 
    date : Date,
    todos : [{
        todo : String,
        date : Date,
        status : Boolean,
        
    }],

}) 



const userModel = new mongoose.model('Users', userSchema)

module.exports = {userModel}