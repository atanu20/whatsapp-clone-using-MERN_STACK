import React, { useContext, useState, useEffect } from 'react'
import { useHistory } from 'react-router';
import { FromContext } from "../../component/FromContext";
import axios from 'axios'
const Premium = () => {
    const [account] = useContext(FromContext);
     const [show, setshow] = useState(false)
    const his = useHistory()

    if (!account.name) {
        his.push('/login')
    }

    const onSub=async(e)=>{
        e.preventDefault()
        setshow(true)
        const data={
            name:account.name,
            userid:account.userID,
            email:account.userEmail,
            price:"50.00"
        }
        

        const res=await axios.post('http://localhost:7000/buynow',data)
        

        if(res.data.success)
        {
            localStorage.setItem('whatsappID',account.userID)
            window.open(res.data.payment_request.longurl,'_self')
        }
        else{
            console.log("something went wrong")
        }


    }
    return (
        <>
            <div className="premium">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 col-12 mx-auto ">
                            {/* d-flex justify-content-center align-items-center flex-column */}
                            <h3 className="text-white text-center">Premium User</h3>
                            <ul className="text-white p-3">
                                <li className="p-2">
                                    If You are a Premium user you will get Text Notification about any chat if you are not online in your platform.
                                </li>
                                <li className="p-2">
                                    If you want to be a Premium user you have to pay  ₹50.00 per month.
                                </li>
                                <li className="p-2">
                                    When you exceed you dateline we will inform you about Premium Feature in you Profile Section
                                </li>
                                <li className="p-2">
                                    This Fetaures applicable for 28 days after payment.
                                </li>
                                <button className="btn btn-info m-1" onClick={() => his.push("/")}>Go Back</button>



                            </ul>
                        </div>
                        <div className="col-md-6 col-12 mx-auto p-3">
                            <div className="card p-3">
                                <h4 className="text-dark text-center p-2">Payment Details</h4>
                                <form className="text-dark " onSubmit={onSub}>
                                    <div class="form-group">
                                        <label for="">Name:</label>
                                        <input type="text" class="form-control" name="name" value={account.name} readOnly />
                                    </div>
                                    <div class="form-group">
                                        <label for="">Email:</label>
                                        <input type="email" class="form-control" name="email" value={account.userEmail} readOnly />
                                    </div>
                                    <div class="form-group">
                                        <label for="usr">Amount:</label>
                                        <input type="text" class="form-control" name="name" value="50.00" readOnly />
                                    </div>
                                    <div className="text-center">
                                        <button className="btn btn-info" disabled={show}>Buy Now</button>
                                    </div>
                                </form>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Premium
