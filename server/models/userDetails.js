const mongoose =require("mongoose")

const userDetailsScheme=new mongoose.Schema({
    googleId:{
        type:String,
        require:true,
        trim:true
    },   
    name:{
        type:String,
        require:true,
        trim:true
    },
    email:{
        type:String,
        require:true,
        unique:true,
        trim:true

    },
    phone:{
        type:String,
        default:"",
        require:true,
        trim:true
    },
    imageUrl:{
        type:String,
        require:true,
        trim:true
    }
})

const userDetailsTable=new mongoose.model('userDetail',userDetailsScheme);
module.exports =userDetailsTable