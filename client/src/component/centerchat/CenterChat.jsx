import React,{useEffect,useState,useRef} from 'react'
import Message from './Message'
import axios from 'axios'
import CircularProgress from '@material-ui/core/CircularProgress';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { io } from "socket.io-client";

const CenterChat = ({downshow,account,setGpConversationMsg,gpconversationmsg,gpId,conversationId,conversationmsg,whatsappId,setNewMessage,newMessage,setConversationMsg,onlineUser,download,checkGroup}) => {
    const scrollRef = useRef();
    const [star, setStar] = useState(false)
    const [user, setUser] = useState([]);
    const [usergp, setUsergp] = useState([]);
    const [postimg, setPostimg] = useState([])
    const socket = useRef();
    const [postprev, setPostprev] = useState(false)
    const [loading, setLoading] = useState(false)
    const [friendId, setFriendId] = useState("")


    

    const getConDetails=async()=>{
        const res=await axios.get(`http://localhost:7000/conversationid/${conversationId}`)
        
        const receiverId = res.data.members.find(
            (member) => member !== whatsappId
          );
          if(receiverId)
          {
            const ress=await axios.get(`http://localhost:7000/userById/${receiverId}`)
            const rs=await axios.get(`http://localhost:7000/checkPremium/${receiverId}`)
            setUser(ress.data)
            setFriendId(receiverId)
            // console.log(rs.data)
            setStar(rs.data.status)
          }
          
        //   console.log(receiverId)
    }
    
  //   const checkPremium=async()=>{
  //     if(friendId)
  //     {
  //       const res=await axios.get(`http://localhost:7000/checkPremium/${friendId}`)
  //     console.log(res.data)
  //     if(res.data.status)
  //     {
  //         setStar(true)

  //     }
  //     else{
  //         setStar(false)
  //     }

  //     }
      
  // }

        useEffect(() => {
           getConDetails()
           
        }, [conversationId])

      //   useEffect(() => {
         
      //     checkPremium()
      //  }, [conversationId])


       
    
       

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      }, [conversationmsg,gpconversationmsg]);


      const handleSubmit=async(e)=>{
        e.preventDefault();
       
        const message = {        
          conversationId: conversationId,
          senderId: whatsappId,
          text: newMessage,
        };


        socket.current = io("http://localhost:9000");
        socket.current.emit("addUser",whatsappId);
        // console.log(user.phone)
        socket.current.emit("sendMessage", {
            senderId: whatsappId,
            sendername:account.name,
           senderstatus:star,
            receiverId:friendId,
            receiverphone:user.phone,
            text: newMessage,
            imgtext:""
          });


        try {
            const res = await axios.post("http://localhost:7000/sendconv", message);
             setConversationMsg([...conversationmsg, res.data]);
            // getConversionMsg()
            // console.log(conversationmsg)
            setNewMessage("");
          } catch (err) {
            console.log(err);
          }
        // console.log(message)
    }








    const notify = (msg) => toast.error(msg, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        });


    const postSub=async(e)=>{
        e.preventDefault()
        setPostprev(false)
        setLoading(true)


        if(postimg.size>4000000)
      {
        notify("File should be less then 4 MB")
            
            setPostimg([])
            setLoading(false)
       
      }
      else{

        if(postimg.type==='image/jpeg' || postimg.type==='image/jpg' || postimg.type==='image/png')
        {
          let formData=new FormData();
        formData.append("file",postimg)
        formData.append("upload_preset","blogpost")

        axios.post("https://api.cloudinary.com/v1_1/du9emrtpi/image/upload",formData
        ).then((response)=>{
         const oneimg=response.data.secure_url;

         socket.current = io("http://localhost:9000");
         socket.current.emit("addUser",whatsappId);
         socket.current.emit("sendMessage", {
             senderId: whatsappId,
             sendername:account.name,
           senderstatus:star,
             receiverId:friendId,
             receiverphone:user.phone,
             text: "",
             imgtext:oneimg
           });
         
   
          axios.post("http://localhost:7000/uploadpost",{
         
            conversationId: conversationId,
            senderId: whatsappId,
            imgtext:oneimg

   
       }).then((res)=>{
        if(res.data)
        {
           
            setConversationMsg([...conversationmsg, res.data]);
           setPostimg([])
           setLoading(false)
          
        }



       })        
        });

           


        }
        else{
                notify("Only jpg ,jpeg and PNG")
            
            setPostimg([])
            setLoading(false)
        }

      }

      
       
        

    }






    const handelImg=(e)=>{
        const { files } = e.target
        if (files.length > 0) {
            setPostimg(files[0])
            setPostprev(true)
           
        } 
    }


// console.log(onlineUser)





const handlegpSubmit=async(e)=>{
  e.preventDefault();
       
        const message = {        
          gpId: gpId,
          senderId: whatsappId,
          text: newMessage,
        };

        socket.current = io("http://localhost:9000");
        socket.current.emit("addUser",whatsappId);
        socket.current.emit("sendgpMessage", {
            senderId: whatsappId,
           gpId:gpId,
            text: newMessage,
            imgtext:""
          });

        try{
          const res = await axios.post("http://localhost:7000/uploadgppost", message);
            if(res.data)
            {
              // setGpConversationMsg([...gpconversationmsg, res.data]);
           
              setNewMessage("");
            }

        }catch(err)
        {
          console.log(err)
        }

}

const gppostimg=async(e)=>{
  e.preventDefault()
  setPostprev(false)
  setLoading(true)


  if(postimg.size>4000000)
{
  notify("File should be less then 4 MB")
      
      setPostimg([])
      setLoading(false)
 
}
else{

  if(postimg.type==='image/jpeg' || postimg.type==='image/jpg' || postimg.type==='image/png')
  {
    let formData=new FormData();
  formData.append("file",postimg)
  formData.append("upload_preset","blogpost")

  axios.post("https://api.cloudinary.com/v1_1/du9emrtpi/image/upload",formData
  ).then((response)=>{
   const oneimg=response.data.secure_url;

   socket.current = io("http://localhost:9000");
   socket.current.emit("addUser",whatsappId);
   socket.current.emit("sendgpMessage", {
       senderId: whatsappId,
       gpId:gpId,
       text: "",
       imgtext:oneimg
     });
   

    axios.post("http://localhost:7000/uploadgppost",{
   
      gpId:gpId,
      senderId: whatsappId,
      imgtext:oneimg


 }).then((res)=>{
  if(res.data)
  {
     
    // setGpConversationMsg([...gpconversationmsg, res.data]);
     setPostimg([])
     setLoading(false)
    
  }



 })        
  });

     


  }
  else{
          notify("Only jpg ,jpeg and PNG")
      
      setPostimg([])
      setLoading(false)
  }

}

}


const getOneGp=async()=>{
  const res=await axios.get(`http://localhost:7000/gpById/${gpId}`)
  
  setUsergp(res.data)
  
  
}

useEffect(() => {
  getOneGp()
  // console.log(gpId)
 
}, [gpId])


    
    return (
        <>

        {
          !checkGroup ?(
            <>
            <div className="centerbox">
                {
                    user && <div className="center-top">
                    <div className="imgleft">
                        <img src={user.imageUrl} alt={user.name} className='proimg' />
                        <div className="pl-2 centerin">
            <span>{user.name}</span>
            {
              onlineUser?.find((val)=> val._id===user._id) ? <small>Online</small> : <small>Offline</small>
            }
            {/* <small>Online</small> */}
            
           </div>
                    </div>
                    <div className="logut pr-3"  >
                      <button className={downshow ? "downbtnone" : "downbtn" }  onClick={download}> <i className="fa fa-download"  aria-hidden="true" ></i></button>
                    
                   
                    </div>


                </div>
                }
                
                <div className="center-chat" style={{
                    backgroundImage: 'linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)),url("image/bg.jpg")'
                }}>

                
                     <div ref={scrollRef}>
                           

                           {
                   conversationmsg?.map((m,ind)=>{
                       return(
                           <>
                           <div ref={scrollRef}>
                           <Message key={ind} message={m} own={m.senderId === whatsappId}  />
                           </div>
                           </>
                       )
                   })
               }

                           </div>


                    
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="bottom-center">



                        <input type="text" className="inputbox" placeholder="Write Message" name="msg" autoComplete="off" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} required />

                        <button type="submit" className="btn btn-success ml-1 mr-1" ><i className="fa fa-paper-plane" aria-hidden="true"></i></button>
                        <button type="button" className="btn btn-dark" data-toggle="modal" data-target="#myModal"><i className="fa fa-file-image-o" aria-hidden="true"></i></button>
                        <div class="modal fade" id="myModal">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
      
       
        <div class="modal-header">
          <h4 class="modal-title text-dark">Upload File</h4>
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>
        
        
        <div class="modal-body text-dark">

        {
                    postprev ? <div className="imgbox">
                    <img src={URL.createObjectURL(postimg)} alt="" className="postim" />                
                    </div> : null

                }
                {
                     loading && <div className="lodbox"> <CircularProgress  /> <br/></div> 
                 }

        <label htmlFor="file" >
                            <p className="textb">Upload Image</p>
                            <input
                style={{ display: "none" }}
                type="file"
                id="file"
                
                accept=".png,.jpeg,.jpg"
                onChange={handelImg}
              />
                        </label>
        </div>
        
        
        <div class="modal-footer">
          <button type="button" disabled={loading} class={loading? "btn btn-dark btnn":"btn btn-dark"} onClick={postSub} >Send Now</button>
        </div>
        
      </div>
    </div>
  </div>

                    </div>
                </form>
            </div>
            <ToastContainer/>

            </>

          ):(
            <>
            <div className="centerbox">
                {
                    usergp && <div className="center-top">
                    <div className="imgleft">
                      
                        <img src={usergp.gpimg} alt={usergp.gpname} className='proimg' />
                        <div className="pl-2 centerin">
            <span>{usergp.gpname}</span>
            
            
            
           </div>
                    </div>
                    {/* <div className="logut pr-3" onClick={download}>
                    <i className="fa fa-download" aria-hidden="true" ></i>
                   
                    </div> */}


                </div>
                }
                
                <div className="center-chat" style={{
                    backgroundImage: 'linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)),url("image/bg.jpg")'
                }}>

                
                     <div ref={scrollRef}>
                           

                           {
                   gpconversationmsg?.map((m,ind)=>{
                       return(
                           <>
                           <div ref={scrollRef}>
                           <Message key={ind} message={m} own={m.senderId === whatsappId}  />
                           </div>
                           </>
                       )
                   })
               }

                           </div>


                    
                </div>
                <form onSubmit={handlegpSubmit}>
                    <div className="bottom-center">



                        <input type="text" className="inputbox" placeholder="Write Message" name="msg" autoComplete="off" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} required />

                        <button type="submit" className="btn btn-success ml-1 mr-1" ><i className="fa fa-paper-plane" aria-hidden="true"></i></button>
                        <button type="button" className="btn btn-dark" data-toggle="modal" data-target="#myModal"><i className="fa fa-file-image-o" aria-hidden="true"></i></button>
                        <div class="modal fade" id="myModal">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
      
       
        <div class="modal-header">
          <h4 class="modal-title text-dark">Upload File</h4>
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>
        
        
        <div class="modal-body text-dark">

        {
                    postprev ? <div className="imgbox">
                    <img src={URL.createObjectURL(postimg)} alt="" className="postim" />                
                    </div> : null

                }
                {
                     loading && <div className="lodbox"> <CircularProgress  /> <br/></div> 
                 }

        <label htmlFor="file" >
                            <p className="textb">Upload Image</p>
                            <input
                style={{ display: "none" }}
                type="file"
                id="file"
                
                accept=".png,.jpeg,.jpg"
                onChange={handelImg}
              />
                        </label>
        </div>
        
        
        <div class="modal-footer">
          <button type="button" disabled={loading} class={loading? "btn btn-dark btnn":"btn btn-dark"} onClick={gppostimg} >Send Now</button>
        </div>
        
      </div>
    </div>
  </div>

                    </div>
                </form>
            </div>
            <ToastContainer/>

            </>
          )
        }
            
        </>
    )
}

export default CenterChat
