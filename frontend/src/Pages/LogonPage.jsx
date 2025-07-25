'use client'

import React, { useState, useEffect } from 'react'
import { useToast } from "@chakra-ui/react";
import axios from "axios";
// import { useNavigate } from "react-router-dom";
import { useHistory, Link } from 'react-router-dom/cjs/react-router-dom.min'
// import { useNavigate } from 'react-router';

const LogonPage = () => {
  const [show,setShow] = useState()

  const [email, setEmail] = useState()
  const [password, setPassword] = useState()

  const [loading, setLoading] = useState(false)

  const toast = useToast()
  // const navigate = useNavigate()

  const handleClick = () => {
    setShow(!show)
  }

  const history = useHistory()
  
  useEffect(() => {
      const user = JSON.parse(localStorage.getItem("userInfo"))

      if (user){
          history.push("/chats")  // if user is already logged in, push him back to chats page
      }
  }, [history])

  const GuestSubmitHandler = async () => {
    submitHandler("guest@example.com", "123456");
  }

  const submitHandler = async (emailInput, passwordInput) => {
    setLoading(true);
  
    const emailToUse = emailInput ?? email;
    const passwordToUse = passwordInput ?? password;
  
    if (!emailToUse || !passwordToUse) {
      toast({title: "Fill all Fields", status: "warning", duration: 5000, isClosable: true, position: "bottom",});
      setLoading(false);
      return;
    }
  
    try {
      const config = { headers: { "Content-type": "application/json" } };
  
      const { data } = await axios.post(`${process.env.REACT_APP_SERVER}/api/user/login`, { email: emailToUse, password: passwordToUse }, config);
  
      toast({ title: "Login Successful", status: "success", duration: 5000, isClosable: true, position: "bottom" });
  
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      window.location.href = "/chats";
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response?.data?.message || error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <div className='auth-page'>
      <div className='login'>
        <h1 style={{display:'flex', justifyContent:'center'}}  className='centre'>
          <img src='/images/Troupe_Logo.png' height={'48'} width={'48'} style={{margin:'5px'}}/>
          <span><h1>TROUPE</h1></span>
        </h1>
        <h1>SIGN IN</h1>
        <div className='label-input-pair'>
          
          <div><input className='input-decor' placeholder='Enter your Email' onChange={(e) => {setEmail(e.target.value)}}/></div>     
        </div> 
        <div>
          
          <div className='password'>
            <input className="input-decor" placeholder='Enter your Password' onChange={(e) => {setPassword(e.target.value)}} type={show ? "text":"password"}/>
            <button onClick={handleClick}>{show ? (<i className="fa-solid fa-eye-slash"></i>):(<i className="fa-solid fa-eye"></i>)}</button>
          </div>
            
        </div> 

        <div className='centre'>
          
          <div><button className='primary-btn centre' style={{width:100}} isLoading={loading} onClick={() => submitHandler()}>LOGIN</button></div>
          <div>
            <button className='primary-btn' 
            onClick={GuestSubmitHandler}>
              LOGIN AS GUEST</button>
          </div>
          <br></br> 
          <div><Link to="/register"><button className='primary-btn'>SIGN UP</button></Link></div>
        </div>  
        
          
      </div>
    </div>
    
  )
}

export default LogonPage