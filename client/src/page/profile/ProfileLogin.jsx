import React, { useContext, useState, useEffect } from 'react'
import { useHistory } from 'react-router';
import { FromContext } from "../../component/FromContext";
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import Profile from './Profile';

const ProfileLogin = () => {
    const [account,setAccount] = useContext(FromContext);
    const [email, setEmail] = useState(account.userEmail)
    const [star, setStar] = useState(false)
    const [password, setPassword] = useState("")
    const [show, setShow] = useState(false)
    const [msg, setMsg] = useState("")
    const [leftConv, setLeftConv] = useState([])
    const [phone, setPhone] = useState("")

    const [loginshow, setloginShow] = useState(false)

    const his = useHistory()

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

    if (!account.name) {
        his.push('/login')
    }




    const getmyConv = async () => {
        const res = await axios.get(`http://localhost:7000/conversations/${account.userID}`)
        //    console.log(res.data)
        setLeftConv(res.data)
    }

    useEffect(() => {
        getmyConv()
    }, [])



    const handelSubmit = async (e) => {
        e.preventDefault();
        const data = {
            email: email,
            password: password
        }
        // console.log(data)
        const res = await axios.post('http://localhost:7000/profile-register', data)
        // console.log(res.data)
        if (res.data.status) {

            setloginShow(true)
        }
        else {
            setShow(true)
            setMsg(res.data.msg)
        }

    }

    const updateph=async(e)=>{
        e.preventDefault();
        const res = await axios.post('http://localhost:7000/updateph',{
            phone:phone,
            userid:account.userID
        })
        setAccount({
            ...account,
            phone:phone
        })
        setPhone("")
        // console.log(res.data)
        
    }
    // console.log(account)
   
    return (
        <>
            {
                !loginshow ? (<>
                    <div className="login-container">

                        <div className="login-box p-3">
                            {
                                show && <div class="alert alert-info alert-dismissible ">
                                    <button type="button" class="close" data-dismiss="alert">&times;</button>
                                    {msg}
                                </div>
                            }
                            <h4 className="text-center p-2">Dashboard Login or SignUp</h4>
                            <br />
                            <form onSubmit={handelSubmit}>
                                <div class="form-group">

                                    <input type="text" class="form-control p-2" placeholder="Enter Email" value={email} name="email" required readOnly />
                                </div>
                                <div class="form-group">

                                    <input type="password" class="form-control p-2" placeholder="Enter password" value={password} name="password" onChange={(e) => setPassword(e.target.value)} required />
                                </div>
                                <div className="text-center">
                                    <button className="btn btn-info pt-2 pb-2 pl-5 pr-5">Login</button>
                                </div>
                                {/* <NavLink to="/profile">ppp</NavLink> */}
                            </form>
                        </div>

                    </div>

                </>) : (
                    <>
                        <div className="profile ">
                            <div className="container text-white">
                                <div className="row">
                                    <div className="col-md-6 col-12 mb-3 text-center">
                                        <img src={account.imageUrl} alt={account.name} className="proimm" />
                                        <h3>{account.name}</h3>
                                        <h5>{account.userEmail}</h5>
                                        {
                                            account.phone && <h5>{account.phone}</h5>
                                        }
                                        {
                                            star ? <p>You Are A Premium User</p> : <p>You Are Not A Premium User</p>
                                        }
                                        
                                        <br />
                                        <div className="text-center">
                                        <button className="btn btn-info m-1" onClick={() => his.push("/")}>Go Back</button>
                                        {
                                            !star && <button className="btn btn-info m-1" onClick={()=>his.push("/premium")} >Premium User</button>
                                        }
                                        
                                        </div>
                                        {
                                            !account.phone &&  <div className="formbox p-3">
                                            <form onSubmit={updateph} >
                                                <h5 className="p-2 text-dark">Update Your Phone Number</h5>
                                                <div class="form-group">

                                                    <input type="text" class="form-control p-2" placeholder="Enter Phone Number to get Update" value={phone} name="phone" required autoComplete="off" onChange={(e)=>setPhone(e.target.value)}  />
                                                </div>
                                                <div className="text-center">
                                    <button className="btn btn-info pt-2 pb-2 pl-5 pr-5">Send</button>
                                </div>
                                            </form>
                                        </div>
                                        }
                                       
                                    </div>
                                    <div className="col-md-6 col-12 mb-3 ">
                                        <div className="probox p-3">
                                            <h4 className="p-2 ">All Users</h4>
                                            <hr />
                                            <div className="proitems">
                                                {
                                                    leftConv?.map((c, ind) => {
                                                        return (
                                                            <>
                                                                <Profile key={ind} getmyConv={getmyConv} conversation={c} whatsappId={account.userID} />
                                                                <hr />
                                                            </>
                                                        )
                                                    })
                                                }



                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                    </>
                )
            }


        </>
    )
}

export default ProfileLogin
