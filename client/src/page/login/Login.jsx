import React,{useEffect,useState,useContext} from 'react'
import { GoogleLogin } from 'react-google-login';

import { FromContext } from "../../component/FromContext";

import './Login.css'
import axios from 'axios'
import {useHistory} from 'react-router-dom'

const Login = () => {

    const his=useHistory()
    const [account,setAccount] = useContext(FromContext);
   

    const successlogin=async (res)=>{
        // console.log(res)
        const data={
            googleId:res.profileObj.googleId,
            name:res.profileObj.name,
            email:res.profileObj.email,
            imageUrl:res.profileObj.imageUrl
        }
       
        const result=await axios.post('http://localhost:7000/register',data)
        if(result.data)
        {
            localStorage.setItem("whatsappToken",result.data.token)
            setAccount(result.data)
            his.push('/')


        }
        


//         email: "atanuj625@gmail.com"
// familyName: "Wonderful"
// givenName: "Hi"
// googleId: "109652691749427918859"
// imageUrl: "https://lh3.googleusercontent.com/a-/AOh14GiF-XhRb1YQ6vHVVxyerTjodgzLgg6ipoyFReo=s96-c"
// name: "Hi Wonderful"

    }
    const faillogin=(res)=>{
        console.log(res)
    }

   
    return (
        <>
        <header className="foi-header landing-header" style={{
             backgroundImage: 'url("../image/bg_1@2x.png"), url("../image/Bg_2@2x.png")'
        }}>
        <div className="container">
           
            <div className="header-content">
                <div className="row">
                    <div className="col-md-6">
                        <h1>Welcome to <span className="spa">Small Talk</span></h1>
                       <p>Best Secure Chating app , You can chat with anyone.</p>
                       <GoogleLogin
    clientId="964959854687-hpsio91ib38hn15q8g03vuhhi2dbbkvk.apps.googleusercontent.com"
    buttonText="Login With Google"
    isSignedIn={true}
    onSuccess={successlogin}
    onFailure={faillogin}
    cookiePolicy={'single_host_origin'}
  />
                        
                        
                    </div>
                    <div className="col-md-6">
                        <img src="image/phone.svg" alt="app" width="388px" className="img-fluid phimg" />
                    </div>
                </div>
            </div>
        </div>
    </header>
            
        </>
    )
}

export default Login
