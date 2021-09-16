const express=require('express')
const mongoose = require('mongoose');
const cors=require('cors')

var jwt = require('jsonwebtoken');
const fileUpload=require("express-fileupload");
const fs = require('fs');
const path = require('path');
const random = require('random')
let ejs = require("ejs");
const Insta = require("instamojo-nodejs");
var router = express.Router();
const PORT =process.env.PORT || 7000;
const pdf = require('html-pdf');
require("./db/config")
const userDetailsTable=require('./models/userDetails')

const chatingTable=require('./models/usersChat')
const conversationTable=require('./models/userConversation')
const gpTable=require('./models/allGroup')
const gpchatingTable=require('./models/gpChat')
const profileTable=require('./models/userDashboard')
const paymentTable=require('./models/payment')

// const pdfTemplate = require('./documents');

const API_KEY = "***";

const AUTH_KEY = "***";

Insta.setKeys(API_KEY, AUTH_KEY);
Insta.isSandboxMode(true);

const app=express()
app.use(cors())
app.use(express.json())
app.use(fileUpload())

router.get("/",(req,res)=>{
    res.send("hii")
})

router.get("/checkPremium/:id",async(req,res)=>{
  try{
   

    const post = await paymentTable.find({userId:req.params.id,paymentstatus:"done"}).sort({'_id':-1}).limit(1);
    // console.log(post.length)
    if(post.length)
    {
      let date1 = new Date(post[0].date);
    let date2 = new Date();
      
    
    let Difference_In_Time = date2.getTime() - date1.getTime();
      
    
    let Difference_In_Days = Math.round(Difference_In_Time / (1000 * 3600 * 24));
    // console.log(Difference_In_Days)
    if(Difference_In_Days>28)
    {
      res.status(200).send({status:false})
    }
    else{
      res.status(200).send({status:true})
    }
    }
    else{
      res.status(200).send({status:false})
    }
    
    

  }
  catch(err){
    console.log(err)
}
})

router.post('/paydetails',async(req,res)=>{
  try{
    const post = await paymentTable.find({userId:req.body.userId}).sort({'_id':-1}).limit(1);
    
    if(post[0].paymentid === req.body.pyid )
    {
      const ress= await paymentTable.findByIdAndUpdate(post[0]._id, { 
        paymentstatus:"done"
        
  
    },{ new: true });
    
    res.status(200).send({status:true})
    }
    else{
      
      res.status(200).send({status:false})
    }
  
 
  }
  catch(err){
    console.log(err)
}
})

router.post('/buynow',async(req,res)=>{
  try{
    var insta = new Insta.PaymentData();
    const name=req.body.name
    const email=req.body.email
    const price=req.body.price
    const userid=req.body.userid

    // console.log(userid)

   const REDIRECT_URL = "http://localhost:3000/successful";
   insta.setRedirectUrl(REDIRECT_URL);
            insta.send_email = "True";
            insta.send_sms = "False";
            insta.purpose = "Whatsapp Text"; // REQUIRED
            insta.amount = price;
            insta.name = name;
            insta.email = email; // REQUIRED

            Insta.createPayment(insta,async (error, response)=> {
              if(error)
              {
                console.log(error)
              }
              else{
                const responseData = JSON.parse( response );
                const usedet= new paymentTable(
                  {
                    userId:userid,
                    paymentstatus:responseData.payment_request.status,
                    amount:responseData.payment_request.amount,
                    paymentid:responseData.payment_request.id
                  }
                )
                await usedet.save();
                // console.log(responseData)
                res.send(response)
              }

            })

  }catch(err){
      console.log(err)
  }
})

// app.use("/images", express.static(path.join(__dirname, "public/images")));


router.post("/profile-register", async (req,res)=>{
   
  try{
      const exist=await profileTable.findOne({email:req.body.email})
      // console.log(exist)
      if(!exist)
      {
          
          const usedet=new profileTable(req.body)
          //    console.log(usedet._id)
             await usedet.save();

            
         res.status(200).send({status:true})
          
      }
      else{
        const exis=await profileTable.findOne({email:req.body.email,password:req.body.password})
        if(exis)
        {
          res.status(200).send({status:true})
        }
        else{
          res.status(200).send({status:false,msg:"password wrong"})
        }


        
          
      }
      
      
         

      
      

  }catch(err){
      console.log(err)
  }
})
router.post('/updateph',async(req,res)=>{
  try{
    
    const ress= await userDetailsTable.findByIdAndUpdate(req.body.userid, { 
      phone:req.body.phone
      

  },{ new: true });
  res.status(200).send({status:true})

  }catch(err){
      console.log(err)
  }
})

router.get("/updateById/:id",async(req,res)=>{
  try{
    const post = await conversationTable.findOne({_id:req.params.id});
    const ress= await conversationTable.findByIdAndUpdate(post._id, { 
      status:!post.status
      

  },{ new: true });
  res.status(200).send({status:true})
  }catch(err){
      console.log(err)
  }
})













router.post("/creatgp",async(req,res)=>{
  try{
    const usedet=new gpTable({
      gpname:req.body.gpname,
      gpimg:req.body.gpimg
    })
    
       await usedet.save();
       res.json({status:true});

  }catch(err){
    console.log(err)
   }
})

router.get("/allgp",async(req,res)=>{
  try{
    const usedet=await gpTable.find()
    
       
    
       res.json(usedet);

  }catch(err){
    console.log(err)
   }
})


router.get('/gpById/:id',async(req,res)=>{
  try{
      const result=await gpTable.findById(req.params.id)
  
  res.send(result);
  }
  catch(err){
      console.log(err)
     }
})

router.get('/gpmsgById/:id',async(req,res)=>{
  try{
      const result=await gpchatingTable.find({gpId:req.params.id})
  
  res.send(result);
  }
  catch(err){
      console.log(err)
     }
})

router.post("/uploadgppost",async (req,res)=>{
   
  try{           
  
      const newMessage = new gpchatingTable(req.body);
      const savedMessage = await newMessage.save();
      res.status(200).json(savedMessage);
  
      

  }catch(err){
      console.log(err)
  }

})



router.post('/create-pdf', async (req, res) => {
  try{
    const messages = await chatingTable.find({
      conversationId: req.body.conversationId,
    });
    // res.send(messages)
    sendId=req.body.sendId

    const conversation = await conversationTable.findById(req.body.conversationId);
    const da=conversation.members.find((mem)=>mem !==sendId)
    const result=await userDetailsTable.findById(da)
// console.log(result)
    const pdfname=sendId+'.pdf'
    const pdff=path.join(__dirname, './pdfs/', pdfname)
const dataa={
  messages: messages,
      sendId:sendId,
      recivername:result.name,
      reciverimg:result.imageUrl
}
    ejs.renderFile(path.join(__dirname, './views/', "pdfTemplate.ejs"), {
      message:dataa
  }, (err, data) => {
      if (err) {
          res.send(err);
      } else {


        pdf.create(data, {}).toFile(pdff, (err) => {
          if(err) {
              res.send({status:false});
          }
    
          // res.send(Promise.resolve());
          res.send({status:true});
       });

      }
    })



    
  }catch(err){
    console.log(err)
   }
});

router.get('/fetch-pdf/:id', async(req, res) => {
  const id=req.params.id;
  const pdff=id+'.pdf';
  const pdfname=path.join(__dirname, './pdfs/', pdff)
  res.sendFile(pdfname)
})



router.post("/register", async (req,res)=>{
   
    try{
        const exist=await userDetailsTable.findOne({email:req.body.email})
        // console.log(exist)
        if(!exist)
        {
            
            const usedet=new userDetailsTable({googleId:req.body.googleId,name:req.body.name,email:req.body.email,imageUrl:req.body.imageUrl})
            //    console.log(usedet._id)
               await usedet.save();

               const id=usedet._id;
        
           const token=jwt.sign({id},"Whatsappclone",{
               expiresIn:'1d',
           })
       
           res.status(200).send({login:true,token:token,name:usedet.name,userID:usedet._id,userEmail:usedet.email,imageUrl:usedet.imageUrl,phone:usedet.phone})
            
        }
        else{
            const id=exist._id;
        
           const token=jwt.sign({id},"Whatsappclone",{
               expiresIn:'1d',
           })
       
           res.status(200).send({login:true,token:token,name:exist.name,userID:exist._id,userEmail:exist.email,imageUrl:exist.imageUrl,phone:exist.phone})
        }
        
        
           

        
        

    }catch(err){
        console.log(err)
    }
})

const verifyJwt=(req,res,next)=>{
    const token=req.headers["x-access-token"]

    if(!token)
    {
        res.send({login:false,msg:"need token"});
    }
    else{
        jwt.verify(token,'whatsappToken',(err,decoded)=>{
            if(err)
            {
                res.send({login:false,msg:"need to token"});
            }
            else{
                req.userID=decoded.id;
                next();
            }
        })
    }
}

router.get("/isAuth",verifyJwt,(req,res)=>{
    res.send({login:true,msg:"done"});
})



router.get("/alluser",async(req,res)=>{
   try{
    
    const result=await userDetailsTable.find()
    
    res.send(result);


   }catch(err){
    console.log(err)
   }
})

router.get('/userById/:id',async(req,res)=>{
    try{
        const result=await userDetailsTable.findById(req.params.id)
    
    res.send(result);
    }
    catch(err){
        console.log(err)
       }
})



router.post("/uploadpost",async (req,res)=>{
   
    try{           
    
        const newMessage = new chatingTable(req.body);
        const savedMessage = await newMessage.save();
        res.status(200).json(savedMessage);
    
        

    }catch(err){
        console.log(err)
    }

})











//massenger routes conversationTable chatingTable


router.post("/conversationroom", async (req, res) => {
    const newConversation = new conversationTable({
      members: [req.body.senderId, req.body.receiverId],
    });
  
    try {
        
        const conversation = await conversationTable.find({
            $and: [  {members: { $in: [req.body.senderId] }},{members:{ $in: [req.body.receiverId] }}] 
          });
        //   console.log(conversation)
          if(conversation.length)
          {
            res.status(200).json({status:true,msg:"ChatRoom Already  Have"});

          }else{
           
            const savedConversation = await newConversation.save();
            // console.log(savedConversation._id)
            const newMessage = new chatingTable({conversationId:savedConversation._id,senderId:req.body.senderId,text:"Hello!!"});
            await newMessage.save()
            res.status(200).json({status:true,msg:"ChatRoom Created"});
          }

     
    } catch (err) {
      res.status(500).json(err);
    }
  });

  router.get("/conversation/:userId", async (req, res) => {
    try {
      const conversation = await conversationTable.find({
        members: { $in: [req.params.userId] }, status:true
      });
      res.status(200).json(conversation);
    } catch (err) {
      res.status(500).json(err);
    }
  });


  router.get("/conversations/:userId", async (req, res) => {
    try {
      const conversation = await conversationTable.find({
        members: { $in: [req.params.userId] }, 
      });
      res.status(200).json(conversation);
    } catch (err) {
      res.status(500).json(err);
    }
  });


  
  

  router.get("/conversationid/:convId", async (req, res) => {
    try {
      const conversation = await conversationTable.findById(req.params.convId);
      res.status(200).json(conversation);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  router.post("/sendconv", async (req, res) => {
    const newMessage = new chatingTable(req.body);
  
    try {
      const savedMessage = await newMessage.save();
      res.status(200).json(savedMessage);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  router.get("/conversationmsg/:conversationId", async (req, res) => {
    try {
      const messages = await chatingTable.find({
        conversationId: req.params.conversationId,
      });

      if(messages.length)
      {
        res.status(200).json(messages);

      }
      else{
        res.json({msg:"Sorry There is No Conversation between Us"});
      }
      
    } catch (err) {
      console.log(err);
    }
  });


  


app.use(router)

app.listen(PORT,()=>{
    console.log(`App running on ${PORT}`)
})
