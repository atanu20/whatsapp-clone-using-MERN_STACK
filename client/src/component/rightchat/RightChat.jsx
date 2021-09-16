import React,{useContext,useEffect,useState} from 'react'
import { FromContext } from "../../component/FromContext";
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

import axios from 'axios';

const RightChat = ({getmyConv,onlineUser}) => {

    const [account] = useContext(FromContext);
    const [data, setData] = useState([])
    const [search, setSearch] = useState("");


const getuser=async()=>{
    const res=await axios.get('http://localhost:7000/alluser')
    setData(res.data.filter((val)=>val._id!==account.userID))
}

    useEffect(() => {
    getuser()
    
    }, [])


    const notify = (msg) => toast.dark(msg, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        });



const starConv=async(id)=>{
    // console.log(id)
    const data={
        senderId:account.userID,
        receiverId:id
    }
    const res=await axios.post('http://localhost:7000/conversationroom',data)
    // console.log(res.data)
    notify(res.data.msg)
    getmyConv()
}







    // console.log(data)
    return (
        <>
            <div className="rightbox p-3">
                <div className="online-box">
                    <h3 className="pb-2">Online users</h3>
                    <div className="online-user">
                        {
                            onlineUser?.filter((val)=>val._id !==account.userID).map((vall,ind)=>{
                                return(
                                    <>
                                    <div className="online-users">
                            <div className="useimg pl-3">
                                <img src={vall.imageUrl} alt={vall.name} className='proimg' />
                                <span className="online"></span>
                            </div>
                            <div className="userdet">
                                <p className="pl-3 pt-1">{vall.name}</p>
                            </div>
                        </div>

                                    </>
                                )
                            })
                        }
                       
                        
                        
                    </div>





                </div>
                <div className="online-box">
                    <h3 className="pb-2">All users</h3>
                    <div className="search p-3">
                            <div className="form-group">

                                <input type="text" className="form-control" placeholder="Search By Name" value={search} name="search" autoComplete="off" onChange={(e) => setSearch(e.target.value)} />
                            </div>
                            <hr className="srhr" />
                        </div>

                    <div className="all-user">
                        {
                            data?.filter((va)=>{
                                if(search=== "")
                                {
                                    return va
                                }
                                else if(va.name.toLowerCase().includes(search.toLowerCase()))
                                {
                                    return va
                                }
                            }).map((val,ind)=>{
                                return(
                                    <>
                                    <div className="online-use" key={ind}>
                            <div className="usimg pl-3">
                                <img src={val.imageUrl} alt={val.name} className='proimg' />
                                <p className="pl-3 pr-4">{val.name}</p>
                                
                            </div>
                            <div className="userdet">
                               
                                <button className="btn btn-info " onClick={()=>starConv(val._id)}>Start</button>
                            </div>
                        </div>

                                    </>
                                )
                            })
                        }
                       
                        
                        
                        

                       
                    </div>





                </div>

            </div>
            <ToastContainer/>

        </>
    )
}

export default RightChat
