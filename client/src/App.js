import React from 'react';

import { Switch, Route } from 'react-router-dom';
import Home from './page/home/Home';
import Login from './page/login/Login';
import './App.css'

import { DataProvider } from "./component/FromContext";

import ProfileLogin from './page/profile/ProfileLogin';
import Premium from './page/payment/Premium';
import Successful from './page/Successful';

const App = () => {
  return (
    <>
   <DataProvider>
    <Switch>
      <Route exact path ="/" component={Home}/>
      
      <Route exact path ="/profile" component={ProfileLogin}/>
      
      <Route exact path ="/login" component={Login}/>
      <Route exact path ="/premium" component={Premium}/>
      <Route exact path ="/successful" component={Successful}/>
     
    </Switch>
    </DataProvider>
     

    </>
  )
}

export default App;



