const mongoose=require("mongoose")

const paymentSchema=new mongoose.Schema({
    
  
    userId: {
        type: String,
      },
      paymentstatus: {
        type: String,
      },
      amount: {
        type: String,
        
      },
      paymentid:{
        type: String,
      },
      
   
    date:{
        type: Date,
        default: new Date(),
    }
   
})
const paymentTable=new mongoose.model('payment',paymentSchema)
module.exports=paymentTable