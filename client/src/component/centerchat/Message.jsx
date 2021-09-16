import React,{useState} from 'react'
import { format } from "timeago.js";

const Message = ({own,message}) => {
    const [modelImg, setModelImg] = useState("")
    const [show, setShow] = useState(false)

    const imggg=(img)=>{
        setShow(true)
        setModelImg(img)
    }
    const removeimg=()=>{
        setShow(false)
        setModelImg("")
    }
    return (
        <>
            <div className={own ? "message own" : "message"}>
           <div className="messageTop">
               {
                   own ?
                   (
                       <>
                       {
                           message.text && <p className="messageText">{message.text}</p>
                       }
                
                       {
                           message.imgtext && (
                               <>
                               
                               <img src={message.imgtext} alt="msgpost" className="msim" onClick={()=>imggg(message.imgtext)} />

                               

                               </>
                           )

                       }

                       </>
                   ) :(
                       <>
                       
                       {
                           message.text && <p className="messageText">{message.text}</p>
                       }
                        {
                           message.imgtext && (
                               <>
                               
                               <img src={message.imgtext} alt="msgpost" className="msim" onClick={()=>imggg(message.imgtext)} />

                               

                               </>
                           )

                       }
                       </>
                   )
               }
               
            </div>
            <div className="messageBottom"> {new Date(message.date).toDateString()} </div>
           </div>

{
    show && <div className="imgmodel">
    <div className="modelbox">
        <div className="modeltop text-dark">
            <p className="topt" onClick={removeimg}><i class="fa fa-times fa-2x" aria-hidden="true"></i></p>
            
        </div>
        <img src={modelImg} alt="msgpost" className="modelimg" />
    </div>
</div>
}

        </>
    )
}

export default Message
