import React,{useEffect,useState} from 'react'
import axios from 'axios';

const Profile = ({conversation,whatsappId,getmyConv}) => {
    const [user, setUser] = useState([]);
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
      
      const handelclick=async()=>{
    //    console.log(conversation._id)
       const res=await axios.get(`http://localhost:7000/updateById/${conversation._id}`)
// console.log(res.data)
getmyConv()
       
      }
    return (
        <>
            <div className="proitem ">
                <div className="usdet">
                <img src={user.imageUrl} alt={user.name} className='proimg' />
                    <p className="pt-1 pl-2">{user.name}</p>
                </div>
                <div className="actiondet">
                   
                        
                           
                    {
                        conversation.status? (
                            <> 
                             <button className="btn btn-success" onClick={handelclick}>Show</button>
                            </>
                        ) :(
                            <> 
                             <button className="btn btn-danger" onClick={handelclick}>Hide</button>
                            </>
                        )
                    }
                </div>
            </div>


        </>
    )
}

export default Profile

