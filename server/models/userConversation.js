const mongoose=require("mongoose")

const conversationSchema=new mongoose.Schema({
    
  
    members: {
        type: Array,
      },
      status:{
        type:Boolean,
        default:true,
      },
   
    date:{
        type: Date,
        default: new Date(),
    }
   
})
const conversationTable=new mongoose.model('conversation',conversationSchema)
module.exports=conversationTable