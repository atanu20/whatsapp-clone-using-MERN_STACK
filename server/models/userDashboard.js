const mongoose =require("mongoose")

const profileSchema=new mongoose.Schema({
     
    
    email:{
        type:String,
        require:true,
        unique:true,
        trim:true

    },
    password:{
        type:String,
        require:true,
        trim:true
    }
})

const profileTable=new mongoose.model('profile',profileSchema);
module.exports =profileTable