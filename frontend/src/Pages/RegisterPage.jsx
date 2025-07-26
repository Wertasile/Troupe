import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom/cjs/react-router-dom";

const RegisterPage = () => {
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
        headers: {"Content-type": "application/json",}};

      const { data } = await axios.post(`${process.env.REACT_APP_SERVER}/api/user`, {name,email,password,pic,}, config);

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
    

    <div className='auth-page'>
      <div className='login'>
        <h1 style={{display:'flex', justifyContent:'center'}}  className='centre'>
          <img src='/images/Troupe_Logo.png' height={'48'} width={'48'} style={{margin:'5px'}}/>
          <span><h1>TROUPE</h1></span>
        </h1>
        <p className='label-input-pair'>
          <label className='label'>Email</label>
          <input className='input-decor' placeholder='Enter your Email' onChange={(e) => {setEmail(e.target.value)}}/>    
        </p>
        <p className='label-input-pair'>
          <label className='label'>Username</label>
          <input className='input-decor' placeholder='Enter your username' onChange={(e) => {setName(e.target.value)}}/>   
        </p>  
        <p>
          <label className='label'>Password</label>
          <div className="password">
            <input className="input-decor" placeholder='Enter your Password' onChange={(e) => {setPassword(e.target.value)}} type={show ? "text":"password"}/>
            <button onClick={handleClick}>{show ? (<i class="fa-solid fa-eye-slash"></i>):(<i class="fa-solid fa-eye"></i>)}</button>
          </div>
        </p>
        <p>
          <div><label className='label'>Confirm Password</label></div>
          <div className="password">
            <input className="input-decor" placeholder='Enter your Password' onChange={(e) => {setConfirmpassword(e.target.value)}} type={show ? "text":"password"}/>
            <button onClick={handleClick}>{show ? (<i class="fa-solid fa-eye-slash"></i>):(<i class="fa-solid fa-eye"></i>)}</button>
          </div>
        </p>
        <div className="">
            <div>UPLOAD PICTURE</div>
            <div><input type="file" onChange={(e) => postDetails(e.target.files[0])}/></div>
        </div>
        <div className='centre'>
          <div><button className='primary-btn centre' style={{width:100}} onClick={submitHandler}>REGISTER</button></div>
          <div className='centre'><Link to="/">Already have an account? Click here to login!</Link></div>
        </div> 
      </div>
      <div className="supporting-image-login">
        <img src='/images/troupe-login-i.png' width='700'></img>
      </div>

      {/* <FormControl id="pic">
        <FormLabel>Upload your Picture</FormLabel>
        <Input type="file" p={1.5} accept="image/*" onChange={(e) => postDetails(e.target.files[0])}/>
      </FormControl>

      <Button colorScheme="blue" width="100%" style={{ marginTop: 15 }} onClick={submitHandler} isLoading={picLoading}>
        Sign Up
      </Button> */}
      
      </div>


      
    
  );
};

export default RegisterPage;