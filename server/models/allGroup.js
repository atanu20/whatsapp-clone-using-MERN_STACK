const mongoose=require("mongoose")

const gpSchema=new mongoose.Schema({
    
  
   
      
      gpname: {
        type: String,
        
      },
      gpimg: {
        type: String,
        
      },
   
    date:{
        type: Date,
        default: new Date(),
    }
   
})
const gpTable=new mongoose.model('group',gpSchema)
module.exports=gpTable