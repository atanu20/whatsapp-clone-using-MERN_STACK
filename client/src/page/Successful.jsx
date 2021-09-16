import React,{ useContext,useEffect} from 'react'
import { useHistory, useLocation } from 'react-router'
import { FromContext } from "../component/FromContext";
import axios from 'axios'

const Successful = () => {
    const history=useHistory()
    const loc=useLocation()
    const [account] = useContext(FromContext);
    const userid=localStorage.getItem('whatsappID')
    useEffect(() => {
        const paydet=async()=>{
            // console.log(loc.search)
            const str=loc.search;
            const myArr = str.split("=");
          const pyid=myArr[myArr.length-1];
        //   console.log(pyid)
        const data={
            userId:userid,
            pyid:pyid
        }
            const res=  await axios.post(`http://localhost:7000/paydetails`,data)
        //    console.log(his)
        console.log(res.data)
          
         }
         paydet()

    }, [])

    return (
        <>
        <div className="container p-5 text-center">
            <h2>Thank You For Your Payment</h2>
            <button className="btn btn-info" onClick={()=>history.push("/")}>Go Back</button>
            
        </div>
            
        </>
    )
}

export default Successful
