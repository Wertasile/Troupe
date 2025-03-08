import { Button, Center, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useHistory } from "react-router";

const Login = () => {
  const [show,setShow] = useState()

  const [email, setEmail] = useState()
  const [password, setPassword] = useState()

  const [loading, setLoading] = useState(false)

  const toast = useToast()
  const history = useHistory()

  const handleClick = () => {
    setShow(!show)
  }

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({title: "Fill all Feilds", status: "warning", duration: 5000, isClosable: true, position: "bottom",});
      setLoading(false);
      return;
    }

    try {
      const config = {headers: {"Content-type": "application/json",}};

      const { data } = await axios.post("/api/user/login",{ email, password },config);

      toast({title: "Login Successful", status: "success", duration: 5000, isClosable: true, position: "bottom",});
      
      localStorage.setItem("userInfo", JSON.stringify(data)); // user's credentials along with token are saved in local storage, so it is accessible across sessions
      setLoading(false);
      history.push("/chats");  // pushes users to the chat page

    } catch (error) {
      toast({title: "Error Occured!",description: error.response.data.message,status: "error",duration: 5000,isClosable: true, position: "bottom",});
      setLoading(false);
    }
  };

  return (
    
    <div className='login-box'>
      <div className='domine-regular centre'>Welcome Back</div>
      <div className='label-input-pair'>
        <div><label className='label'>Email</label></div>
        <div><input className='input-decor' placeholder='Enter your Email' onChange={(e) => {setEmail(e.target.value)}}/></div>     
      </div> 
      <div>
        <div><label className='label'>Password</label></div>
        <div>
          <input className="input-decor" placeholder='Enter your Password' onChange={(e) => {setPassword(e.target.value)}} type={show ? "text":"password"}/>
          <button onClick={handleClick}>{show ? "hide":"show"}</button>
        </div>
          
      </div> 
          
      <button className='primary-btn centre' style={{width:100}} isLoading={loading} onClick={submitHandler}>LOGIN</button>
        <button className='primary-btn' width="100%" onClick={() => {
          setEmail("guest@example.com")
          setPassword("123456")}
        }>Get Guest Credentials</button> 
    </div> 
    
    
  )
}

export default Login