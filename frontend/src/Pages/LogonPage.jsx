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

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({title: "Fill all Fields", status: "warning", duration: 5000, isClosable: true, position: "bottom",});
      setLoading(false);
      return;
    }

    try {
      const config = {headers: {"Content-type": "application/json",}};

      const { data } = await axios.post("/api/user/login",{ email, password },config);

      toast({title: "Login Successful", status: "success", duration: 5000, isClosable: true, position: "bottom",});
      
      localStorage.setItem("userInfo", JSON.stringify(data)); // user's credentials along with token are saved in local storage, so it is accessible across sessions
      setLoading(false);
      window.location.href = "/chats";  // pushes users to the chat page

    } catch (error) {
      toast({title: "Error Occured!",description: error.response.data.message,status: "error",duration: 5000,isClosable: true, position: "bottom",});
      setLoading(false);
    }
  };

  return (
    <div className='auth-page'>
      <div className='login'>
        <h1>WELCOME TO TROUPE</h1>
        <h1>THE BEST PLACE TO <span>GAME</span></h1>
        <h1>SHARE FILES, AUDIO, IMAGES</h1>
      </div>
      <div className='login login-right'>
        <div className='label-input-pair'>
          <div><label className='label'>Email</label></div>
          <div><input className='input-decor' placeholder='Enter your Email' onChange={(e) => {setEmail(e.target.value)}}/></div>     
        </div> 
        <div>
          <div><label className='label'>Password</label></div>
          <div className='password'>
            <input className="input-decor" placeholder='Enter your Password' onChange={(e) => {setPassword(e.target.value)}} type={show ? "text":"password"}/>
            <button onClick={handleClick}>{show ? (<i className="fa-solid fa-eye-slash"></i>):(<i className="fa-solid fa-eye"></i>)}</button>
          </div>
            
        </div> 

        <div className='centre'>
          <div><button className='primary-btn centre' style={{width:100}} isLoading={loading} onClick={submitHandler}>LOGIN</button></div>
          <div>
            <button className='primary-btn' 
            onClick={() => {
              setEmail("guest@example.com") 
              setPassword("123456")
            }}>GET GUEST LOGIN</button></div> 
          <div><Link to="/register">Not got an account? Click here to join!</Link></div>
        </div>  
        
          
      </div>
    </div>
    
  )
}

export default LogonPage