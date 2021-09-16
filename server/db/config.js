const mongoose =require('mongoose')

// mongoose.connect('mongodb+srv://atanumongo:atanumongo@firstmongoapp.dgqpo.mongodb.net/whatsappclone?retryWrites=true&w=majority',{
//     useCreateIndex:true,
//     useNewUrlParser:true,
//     useUnifiedTopology:true,
//     useFindAndModify:false
// }).then(()=>{
//     console.log("connection done")
// }).catch((e)=>{
//     console.log(e)
// })

mongoose.connect('mongodb://atanumongo:atanumongo@firstmongoapp-shard-00-00.dgqpo.mongodb.net:27017,firstmongoapp-shard-00-01.dgqpo.mongodb.net:27017,firstmongoapp-shard-00-02.dgqpo.mongodb.net:27017/whatsappclone?ssl=true&replicaSet=atlas-s8ggj5-shard-0&authSource=admin&retryWrites=true&w=majority',{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify:false
}).then(()=>{
    console.log("connection done")
}).catch((e)=>{
    console.log(e)
})



