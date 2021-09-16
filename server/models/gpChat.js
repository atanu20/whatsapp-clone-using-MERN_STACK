const mongoose=require("mongoose")

const gpchatSchema=new mongoose.Schema({
    
  
    gpId: {
        type: String,
      },
      senderId: {
        type: String,
      },
      text: {
        type: String,
        default:""
      },
      imgtext: {
        type: String,
        default:""
      },
   
    date:{
        type: Date,
        default: new Date(),
    }
   
})
const gpchatingTable=new mongoose.model('gpchat',gpchatSchema)
module.exports=gpchatingTable