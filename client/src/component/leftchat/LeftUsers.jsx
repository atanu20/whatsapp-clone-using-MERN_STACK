import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { useHistory } from 'react-router';

const LeftUsers = ({setGpId, conversation,whatsappId,setConversationId,setShow,setCheckGroup }) => {
    const [user, setUser] = useState([]);
const history=useHistory()

    useEffect(() => {
      
        const friendId = conversation.members.find((m) => m !== whatsappId);
    
        const getUser = async () => {
          try {
            let res=await axios.get(`http://localhost:7000/userById/${friendId}`);
     
            //   console.log(res.data)
           
            setUser(res.data);
          } catch (err) {
            console.log(err);
          }
        };
        getUser();
      }, [ ]);

      
      // https://whatsapp-socket-aj.herokuapp.com
      

      const handelclick=()=>{
        setConversationId(conversation._id)
        setShow(true)
        setGpId("")
        setCheckGroup(false)
      }


    return (
        <>
            <div className="user"  onClick={handelclick}>
                <div className="userimg pl-3">
                    <img src={user.imageUrl} alt={user.name} className='proimg' />
                </div>
                <div className="userdet">
                    <p className="pl-3 pt-1">{user.name}</p>
                </div>

            </div>
        </>
    )
}

export default LeftUsers
