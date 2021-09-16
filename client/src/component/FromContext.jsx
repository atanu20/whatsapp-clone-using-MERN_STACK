import React , { createContext, useState } from "react";


export const FromContext = createContext();

export const DataProvider = (props) => {
  const [account, setAccount] = useState([]);
  
  

  return (
    <>
      <FromContext.Provider value={[account,setAccount]}>
        {props.children}
      </FromContext.Provider>
    </>
  );
};