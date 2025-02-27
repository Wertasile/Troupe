import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
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
      toast({title: "Please Fill all the Feilds", status: "warning", duration: 5000, isClosable: true, position: "bottom",});
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );

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
    <VStack spacing="5px" color="black">
      
      <FormControl id="email">
        <FormLabel>Email</FormLabel>
        <Input placeholder='Enter your Email' value={email} onChange={(e) => {setEmail(e.target.value)}}/>
      </FormControl>

      <FormControl id="password">
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input placeholder='Enter your Password' value={password} onChange={(e) => {setPassword(e.target.value)}} type={show ? "text":"password"}/>
          <InputRightElement width="4.5rem"><Button h="1.75rem" size="sm" onClick={handleClick}>{show ? "hide":"show"}</Button></InputRightElement>
        </InputGroup>
      </FormControl>


      <Button colorScheme='blue' width="100%" isLoading={loading} onClick={submitHandler}>Login</Button>
      <Button colorScheme='red' width="100%" onClick={() => {
        setEmail("guest@example.com") 
        setPassword("123456")}
      }>Get Guest Credentials</Button>

      
    </VStack>
  )
}

export default Login