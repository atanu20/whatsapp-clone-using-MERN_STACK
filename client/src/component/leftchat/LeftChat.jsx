import React, { useState, useContext,useEffect } from 'react'
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { NavLink, useHistory } from 'react-router-dom';
import { GoogleLogout } from 'react-google-login';
import { FromContext } from "../../component/FromContext";
import LeftUsers from './LeftUsers';
import axios from 'axios';

const LeftChat = ({star, leftConv, setConversationId, setShow,setCheckGroup,setGpId }) => {
    const [open, setOpen] = useState(false);
    const [allGp, setAllGp] = useState([]);

    const [account, setAccount] = useContext(FromContext);
    const his = useHistory()

    if (!account.name) {
        his.push('/login')
    }





const getgp=async()=>{
    const res=await axios.get('http://localhost:7000/allgp')
    setAllGp(res.data)
}

    useEffect(() => {
        getgp()

    }, [])

const handelgp=async(gpid)=>{
    setGpId(gpid)
    setShow(true)
    setCheckGroup(true)
}


    const logout = () => {

        alert("Are you Sure about Logout ?")
        console.clear()
        setAccount("")
    }
    return (
        <>
            {
                account ? (
                    <div className="leftbox">
                        <div className="left-top">
                            <div className="imgleft" onClick={()=>his.push('/profile')}>

                                <div className="immbox">
                                <img src={account.imageUrl} alt="profile" className='proimg' />
                                {
                                    star && <i class="fa fa-star startbox"  aria-hidden="true"></i>
                                }
                                
                                </div>
                                <div className="pl-2">
                                    <p className="pt-1">{account.name}</p>
                                </div>
                            </div>
                            <div className="logout pr-3">


                                <div class="dropdown">
                                    <i className="fa fa-ellipsis-v p-1" aria-hidden="true" ></i>
                                    <div class="dropdown-content">
                                        {/* <NavLink to="/profile-login">Profile</NavLink> */}
                                        <NavLink to="/profile">Profile</NavLink>
                                        <GoogleLogout
                                            clientId="964959854687-hpsio91ib38hn15q8g03vuhhi2dbbkvk.apps.googleusercontent.com"
                                            buttonText="Logout"
                                            onLogoutSuccess={logout}

                                        />
                                    </div>
                                </div>




                            </div>


                        </div>
                        <br /><br />
                        <div className="alluser">
                            {
                                leftConv?.map((c, ind) => {
                                    return (
                                        (
                                            <>
                                                <LeftUsers key={ind} setGpId={setGpId} conversation={c} whatsappId={account.userID} setShow={setShow} setCheckGroup={setCheckGroup} setConversationId={setConversationId} />


                                            </>
                                        )
                                    )
                                })
                            }






                        </div>
                        <div className="allgroup ">
                            <h4 className="pl-2 pb-2">All Groups</h4>
                            <div className="group-items">
                                {
                                    allGp?.map((val,ind)=>{
                                        return(
                                            <>
                                             <div className="group-item" onClick={()=>handelgp(val._id)} key={ind}>
                                    <div className="userimg pl-3">
                                        <img src={val.gpimg} alt={val.gpname} className='proimg' />
                                    </div>
                                    <div className="userdet">
                                        <p className="pl-3 pt-1">{val.gpname}</p>
                                    </div>
                                </div>
                                            </>
                                        )
                                    })
                                }
                               
                            </div>

                        </div>



                    </div>
                ) : (
                    <div className="textleft">
                        <h2>Loading...</h2>
                    </div>
                )
            }

        </>
    )
}

export default LeftChat
