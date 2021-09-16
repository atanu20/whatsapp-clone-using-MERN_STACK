
import React, { useState, useEffect, useContext, useRef } from 'react'
import CenterChat from '../../component/centerchat/CenterChat'
import LeftChat from '../../component/leftchat/LeftChat'
import RightChat from '../../component/rightchat/RightChat'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import { FromContext } from "../../component/FromContext";
import { io } from "socket.io-client";
import { saveAs } from 'file-saver';

const Home = () => {
    const [show, setShow] = useState(false)
    const [downshow, setDownShow] = useState(false)
    const [star, setStar] = useState(false)
    const [leftConv, setLeftConv] = useState([])
    const [conversationId, setConversationId] = useState("")
    const [account, setAccount] = useContext(FromContext);
    const [conversationmsg, setConversationMsg] = useState([])
    const [newMessage, setNewMessage] = useState("");
    const [onlineUser, setOnlineUser] = useState([])
    const [conversionMembers, setConversionMembers] = useState([]);
    const [status, setStatus] = useState(navigator.onLine)

    const [arrivalMessage, setArrivalMessage] = useState(null);

    const [checkGroup, setCheckGroup] = useState(false);
    const [gpId, setGpId] = useState("")
    const [gpconversationmsg, setGpConversationMsg] = useState([])
    const [gparrivalMessage, setGpArrivalMessage] = useState(null);

    const socket = useRef();
    useEffect(() => {
        socket.current = io("http://localhost:9000/");

    }, []);
    useEffect(() => {
        socket.current?.emit("addUser", account.userID);
        socket.current?.on("getUsers", async (users) => {
            const res = await axios.get(`http://localhost:7000/alluser`)
            //  console.log(res.data.filter((val) => users.some((u) => u.userId === val.userID)))
            setOnlineUser(res.data.filter((val) => users.some((u) => u.userId === val._id)))
        });
    }, []);


    const checkPremium=async()=>{
        const res=await axios.get(`http://localhost:7000/checkPremium/${account.userID}`)
        
        if(res.data.status)
        {
            setStar(true)

        }
        else{
            setStar(false)
        }
    }
   

    useEffect(() => {
        checkPremium()
     }, [])



    const his = useHistory()
    const getmyConv = async () => {
        const res = await axios.get(`http://localhost:7000/conversation/${account.userID}`)
        //    console.log(res.data)
        setLeftConv(res.data)
    }
    const getAllConv = async () => {
        const res = await axios.get(`http://localhost:7000/conversationmsg/${conversationId}`)
        setConversationMsg(res.data)
        // setLeftConv(res.data)
    }

    const getConversionMembers = async () => {
        const res = await axios.get(`http://localhost:7000/conversationid/${conversationId}`)
        // console.log(res.data)
        setConversionMembers(res.data)
    }


    useEffect(() => {
        getmyConv()
    }, [])

    useEffect(() => {
        getAllConv()
        getConversionMembers()
    }, [conversationId])

    

    // console.log(conversationId)



    useEffect(() => {
        
        socket.current?.on("getMe", (data) => {
            // console.log(data)
            if (data) {
                setArrivalMessage({
                    senderId: data.senderId,
                    text: data.text,
                    imgtext: data.imgtext,
                    date: Date.now(),
                })


            }

        });
    }, []);



    useEffect(() => {
        // console.log(conversionMembers.members)
        if(conversionMembers.members)
        {

        
        arrivalMessage && conversionMembers?.members.includes(arrivalMessage.senderId) && setConversationMsg((prev) => [...prev, arrivalMessage]);
        
        }
        // console.log(arrivalMessage)

    }, [arrivalMessage]);




    useEffect(() => {

        const online = () => {
            setStatus(true)
        }
        const offline = () => {
            setStatus(false)
        }

        window.addEventListener('online', online)
        window.addEventListener('offline', offline)
        return () => {
            window.removeEventListener('online', online)
            window.removeEventListener('offline', offline)
        }
    }, [])

    const download=async()=>{
        setDownShow(true)
        const res=await axios.post('http://localhost:7000/create-pdf',{
            conversationId,
        sendId:account.userID})
        if(res.data.status)
        {
            const ress=await axios.get(`http://localhost:7000/fetch-pdf/${account.userID}`,{ responseType: 'blob' })
            if(ress)
            {
                const pdfBlob = new Blob([ress.data], { type: 'application/pdf' });

                  saveAs(pdfBlob, 'conversation.pdf');
            }
            setDownShow(false)
        }
        else{
            console.log("something Wrong")
        }
    }




    useEffect(() => {
        
        socket.current?.on("getGpMsg", (data) => {
            // console.log(data)
            if (data) {
                setGpArrivalMessage({
                    senderId: data.senderId,
                    gpId:data.gpId,
                    text: data.text,
                    imgtext: data.imgtext,
                    date: Date.now(),
                })


            }

        });
    }, []);

    useEffect(() => {
        //  console.log()

        
        
        
if(gparrivalMessage )
{
    if(gparrivalMessage.gpId===gpId  )
    {
        // if(gparrivalMessage.senderId!=account.userID)
        // {
        //     gparrivalMessage &&  setGpConversationMsg((prev) => [...prev, gparrivalMessage]);
        // }
        gparrivalMessage &&  setGpConversationMsg((prev) => [...prev, gparrivalMessage]);
    }
    
}
        
        
        
     

    }, [gparrivalMessage]);




const getgpmsg=async()=>{
    const res=await axios.get(`http://localhost:7000/gpmsgById/${gpId}`)
    setGpConversationMsg(res.data)
}


useEffect(() => {
    getgpmsg()
        
    }, [gpId])









    return (
        <>
       {
            status ?(
                <>

              
            <div className="home ">
                <div className="container-fluid p-3">

                    <div className="card table-responsive">
                        <div className="chatbox">
                            <div className="left-bar">
                                <LeftChat star={star} leftConv={leftConv} setConversationId={setConversationId} setGpId={setGpId} setCheckGroup={setCheckGroup} setShow={setShow} />

                            </div>
                            <div className="center-bar">

                                {
                                    show ? (
                                        <>
                                            <CenterChat
                                            
                                                conversationId={conversationId}
                                                conversationmsg={conversationmsg}
                                                whatsappId={account.userID}
                                                setNewMessage={setNewMessage}
                                                newMessage={newMessage}
                                                setConversationMsg={setConversationMsg}
                                                onlineUser={onlineUser}
                                                download={download}
                                                checkGroup={checkGroup}
                                                gpId={gpId}
                                                gpconversationmsg={gpconversationmsg}
                                                setGpConversationMsg={setGpConversationMsg}
                                                account={account}
                                                downshow={downshow}

                                            />
                                        </>
                                    ) : (
                                        <>
                                            <div className="startc">
                                                <h1>Select A Conversation</h1>
                                                <h4>Please ensure about network connectivity</h4>
                                                
                                                
                                            </div>

                                        </>
                                    )
                                }
                            </div>
                            <div className="right-bar">
                                <RightChat getmyConv={getmyConv} onlineUser={onlineUser} />
                            </div>
                        </div>



                    </div>
                </div>

            </div>
            </>
            ) : <div className="onmodel">
            <div className="onbox">
                <h1>You are Offline</h1>
            </div>
        </div>
        }

        </>
    )
}

export default Home
