import { Button } from "@chakra-ui/react";
import { FormControl, FormLabel } from "@chakra-ui/react";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { VStack } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useHistory } from "react-router";

const Signup = () => {
  const [show, setShow] = useState(false);
  
  const toast = useToast();
  const history = useHistory();

  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  
  const [pic, setPic] = useState();
  const [picLoading, setPicLoading] = useState(false);

  const handleClick = () => setShow(!show);

  const submitHandler = async () => {

    setPicLoading(true);
    if (!name || !email || !password || !confirmpassword) {
      toast({title: "Please Fill all the Feilds", status: "warning", duration: 5000, isClosable: true, position: "bottom",});
      setPicLoading(false);
      return;
    }

    if (password !== confirmpassword) {
      toast({title: "Passwords Do Not Match", status: "warning", duration: 5000, isClosable: true, position: "bottom",});
      return;
    }

    console.log(name, email, password, pic);

    try {

      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user",
        {
          name,
          email,
          password,
          pic,
        },
        config
      );

      console.log(data);

      toast({title: "Registration Successful", status: "success", duration: 5000, isClosable: true, position: "bottom",});

      localStorage.setItem("userInfo", JSON.stringify(data));
      setPicLoading(false);
      history.push("/chats");

    } catch (error) {
        toast({title: "Error Occured!", description: error.response.data.message, status: "error", duration: 5000, isClosable: true, position: "bottom",

      });
      setPicLoading(false);
    }
  };

  const postDetails = (pics) => {
    setPicLoading(true);

    if (pics === undefined) {
      toast({title: "Please Select an Image!", status: "warning", duration: 5000, isClosable: true, position: "bottom",
      });
      return;
    }

    if (pics.type !== "image/jpeg" && pics.type !== "image/png") {
      toast({title: "Please Select a JPEG or PNG Image!",status: "warning",duration: 5000,isClosable: true, position: "bottom",
      });
      setPicLoading(false);
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {

      const data = new FormData()
      data.append("file", pics)
      data.append("upload_preset","chat-app")
      data.append("cloud_name","dxbhffudn")
      axios.post("https://api.cloudinary.com/v1_1/dxbhffudn/image/upload", data)
        .then((response) => {
          console.log("Cloudinary response:", response);
          setPic(response.data.url.toString());
          setPicLoading(false);
          toast({title: "Image uploaded successfully!", status: "success", duration: 5000, isClosable: true, position: "bottom",});
        })
        .catch((error) => {
          console.log("Cloudinary error:", error);
          setPicLoading(false);
        });
    }
  }

  return (
    <VStack spacing="5px">

      <div className='login-box'>
        <div className="centre domine-regular">Join the Community!</div>
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
        <div>
          <div><label className='label'>Confirm Password</label></div>
          <div>
            <input className="input-decor" placeholder='Enter your Password' onChange={(e) => {setConfirmpassword(e.target.value)}} type={show ? "text":"password"}/>
            <button onClick={handleClick}>{show ? "hide":"show"}</button>
          </div>
        </div> 
      </div>


      <FormControl id="pic">
        <FormLabel>Upload your Picture</FormLabel>
        <Input type="file" p={1.5} accept="image/*" onChange={(e) => postDetails(e.target.files[0])}/>
      </FormControl>

      <Button colorScheme="blue" width="100%" style={{ marginTop: 15 }} onClick={submitHandler} isLoading={picLoading}>
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;