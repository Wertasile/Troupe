
import { IconButton, Spinner, useToast, Box, Text, Input, FormControl, Tooltip } from "@chakra-ui/react";
import { getSender, getSenderFullDetails } from "../config/ChatLogics";
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles.css"
import { ChatState } from "../Context/ChatProvider";
import ScrollableChat from "./ScrollableChat";
import AWS from 'aws-sdk'; // Import entire SDK (optional)
// import AWS from 'aws-sdk/global'; // Import global AWS namespace (recommended)
import S3 from 'aws-sdk/clients/s3'; // Import only the S3 client
import io from "socket.io-client"
import MicRecorder from 'mic-recorder-to-mp3';

const recorder = new MicRecorder({ bitRate: 128 });
AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET,
});
const REGION = "us-east-1"

// socket io stuff below
// const ENDPOINT = "http://localhost:5000"
const ENDPOINT = "https://real-time-chat-app-mern-un4z.onrender.com"
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain, modal, setModal  }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [attachment, setAttachment] = useState("false");

  const [image, setImage] = useState(null)
  const [uploading, setUploading] = useState(false)

  const [audio, setAudio] = useState(null)
  const [isBlocked, setIsBlocked] = useState(false);
  const [blobUrl, setBlobUrl] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState(null);
  
  const [file, setFile] = useState(null)

  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // state for real; time message socket
  const [socketConnected, setSocketConnected] = useState(false)

  const allowedTypesImageUpload = [
    'image/jpeg',
    'image/png',
    // Add more supported types as needed
  ];

  const toast = useToast();

  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ChatState();

  const fetchMessages = async () => {
    
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      console.log("messages fetched")
      console.log(messages)
      setLoading(false);
      // emitting the signal to join the room, with the id of the chat, we create a new room so users can join that particular room i.e. chat
      socket.emit("join chat", selectedChat._id)

      
    } catch (error) {
      toast({title: "Error Occured!",description: "Failed to Load the Messages",status: "error",duration: 5000,isClosable: true,position: "bottom",
      });
    }
  };

  useEffect(() => {
    // starting socket connection
    socket = io(ENDPOINT)
    socket.emit("setup", user)  // emit something from here in the set up 
    socket.on("connected", () => {
      setSocketConnected(true)
    })

    // for typing checking
    socket.on("typing", () => setIsTyping(true))
    socket.on("stop typing", () => setIsTyping(false))
  }, [])

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat // this keeps a backup of whatever the selectedChat is so we can compare it and know wether to emit to user or to send notif
    // eslint-disable-next-line
    setAttachment(false)
  }, [selectedChat]);

  
  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id){ // checking if a chat is selected (or) selected chat is the chat we got a new message for
        // GIVE NOTIFICATION
        if (!notification.includes(newMessageReceived)){  // if notification array doesnt include the new messafe received
          // then we add the new message received to the notification array
          setNotification([newMessageReceived, ...notification])
          setFetchAgain(!fetchAgain)
        } 
        
      } else {
        setMessages([...messages, newMessageReceived])
      }
    }) // monitors socket to see if we receive anything from this socket
    
  }) // we want to update this useEFFECT ON EVERY STATE UPDATE



  const sendMessage = async (event, type="text", url="") => {
    
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id)
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            messageType: type,
            url : "url",
            chatId: selectedChat._id,
          },
          config
        );

        // emitting the new message (data from API call)
        socket.emit("new message", data)

        console.log("new message", data)

        setMessages([...messages, data]);
        
      } catch (error) {
        toast({title: "Error Occured!",description: "Failed to send the Message",status: "error",duration: 5000,isClosable: true,position: "bottom",});
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value)

    // typing indicator logic

    //first check if socket is connected
    if (!socketConnected) return

    // if socket is connected then we check the typing
    if (!typing){
      setTyping(true)
      socket.emit("typing", selectedChat._id) // we are emitting this in the selectedchat id room
    }

    // debouncing, where to set typing not typing based on a timer
    let lastTypingTime = new Date().getTime()
    var timerLength = 3000
    setTimeout(() => {
      var timeNow = new Date().getTime()
      var timeDiff = timeNow - lastTypingTime

      if (timeDiff >= timerLength && typing){
        socket.emit("stop typing", selectedChat._id)  // we are emitting stop typing socket in the room of the selectedchat
        setTyping(false)
      }
    }, timerLength)
  };

//--------------------------------------------------------------------------------------------------------------------------------

  // FOR AUDIO UPLOADS

  // 1) USE EFFECT WHICH PROMPTS PERMISSIONS FOR AUDIO
  useEffect(() => {
    setRecorder(new MicRecorder({ bitRate: 128 }));
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then(() => {
        console.log("Permission Granted");
        setIsBlocked(false);
      })
      .catch(() => {
        console.log("Permission Denied");
        setIsBlocked(true);
      });
  }, []);

  const startRecording = async () => {
    if (isBlocked) {
      console.log("Permission Denied");
    } 
    else {
      try {
        await recorder.start();
        setIsRecording(true)
      } catch (err) {
        console.error("Error starting recording:", err);
      }
    }
  };

  // 1) WHEN FILE IS UPLOADED, AUDIO IS SET

  const stopRecording = async () => {
    if (!recorder) {
      console.error("Recorder is not initialized");
      return;
    }
    try {
      const [buffer, blob] = await recorder.stop().getMp3();
      const newBlobUrl = URL.createObjectURL(blob);
      setBlobUrl(newBlobUrl);
      setIsRecording(false);

      const file = new File([blob], `${Date.now()}.mp3`, { type: "audio/mp3" });
      console.log("Blob size:", blob.size);
      console.log(file);
      console.log("Setting Audio File:", blob);
      setAudio(file); // State update
      // uploadAudioFile(file); // Use the new file immediately
    
      
    } catch (error) {
      console.error("Error stopping recording:", error);
    }
    
  };

  // 2) ONCE AUDIO IS SET, USEEFFECT TRIGGERS UPLOAD AUDIO
  useEffect(() => {
    if (audio) {
      console.log("2) use effect, audio uploading:", audio);
      uploadAudioFile();
      console.log("2) use effect, audio uplaoded:", audio);
    }
  }, [audio]);

  // 3) UPLOAD IMAGE UPLOADS IT TO AWS, THEN WE GET IT BACK FOR DISPLAY, AND SEND THE IMAGE AS A MESSAGE
  const uploadAudioFile = async () => {
    console.log("audio-name: " + audio.name)
    console.log("audio-type: " + audio.type)
    const fileName = audio.name;
    const fileType = audio.type;

    const s3audio = new S3({
      params: { Bucket: "discourse-voice-bucket" },
      region: REGION,
    });

    const s3audioParams = {
      Bucket: "discourse-voice-bucket",
      Key: `${audio.name}`,
      Body: audio,
    };

    try {
      const upload = await s3audio.putObject(s3audioParams).promise();
      console.log("UPLOADED DATA" + upload);
      setUploading(false)
      alert("Audio uploaded successfully.");

      const url = s3audio.getSignedUrl('getObject', {
        Bucket: "discourse-voice-bucket",
        Key: fileName
      })
      console.log(url)

      sendAudio(url, fileName, fileType)

    } catch (error) {
      console.error(error);
      setUploading(false)
      alert("Error uploading audio: " + error.message); // Inform user about the error
    }
  };

  const sendAudio = async (url, fileName, fileType) => {    
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    };
    setNewMessage("");

    const { data } = await axios.post(
      "/api/message",
      {
        content: fileName,
        messageType: "audio",
        url : url,
        chatId: selectedChat._id,
      },
      config
    );

    console.log("data after api call" + data)

    setMessages([...messages, data]);
  }

//--------------------------------------------------------------------------------------------------------------------------------

  // FOR IMAGE UPLOADS

  // 1) WHEN FILE IS UPLOADED, IMAGE IS SET
  const handleImageChange = (e) => {
    const uploadedfile = e.target.files[0]
    if (allowedTypesImageUpload.includes(uploadedfile.type)){
      setImage(uploadedfile)
      console.log(uploadedfile)
      
    }
    else{
      toast({title: "Error Occured!",description: "Put valid file type",status: "error",duration: 5000,isClosable: true,position: "bottom",})
    }

  }

  // 2) ONCE IMAGE IS SET, USEEFFECT TRIGGERS UPLOAD IMAGE
  useEffect(() => {
    if (image) {
      uploadImage();
    }
  }, [image]);  // Runs uploadImage whenever image changes


  
  // 3) UPLOAD IMAGE UPLOADS IT TO AWS, THEN WE GET IT BACK FOR DISPLAY, AND SEND THE IMAGE AS A MESSAGE
  const uploadImage = async () => {
    setUploading(true)
    const S3_BUCKET = "discourse-image-bucket"

    console.log(`REGION : ${REGION}`)
    console.log(`S3 BUCKET : ${S3_BUCKET}`)

    const imagearray = image.name.split(".")
    const imagename = imagearray[0]
    const imagetype = imagearray[1]

    

    const s3 = new S3({
      params: { Bucket: S3_BUCKET },
      region: REGION,
    });

    const params = {
      Bucket: S3_BUCKET,
      //format : imagename-userid.png 
      Key: `${imagename}-${user._id}.${imagetype}`,  // name for the file
      Body: image,                                    // the file itself
    };

    try {
      const upload = await s3.putObject(params).promise();
      console.log("UPLOADED DATA" + upload);
      setUploading(false)
      alert("File uploaded successfully.");

      const url = s3.getSignedUrl('getObject', {
        Bucket: S3_BUCKET,
        Key: `${imagename}-${user._id}.${imagetype}`
      })
      console.log(url)

      sendImage(url)

    } catch (error) {
      console.error(error);
      setUploading(false)
      alert("Error uploading file: " + error.message); // Inform user about the error
    }
  };

  // 4) MESSAGE IS NOW SENT AS AN IMAGE
  const sendImage = async (url) => {
    const imagearray = image.name.split(".")
    const imagename = imagearray[0]
    const imagetype = imagearray[1]
    
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    };
    setNewMessage("");

    const { data } = await axios.post(
      "/api/message",
      {
        content: `${imagename}-${user._id}.${imagetype}`,
        messageType: "image",
        url : url,
        chatId: selectedChat._id,
      },
      config
    );

    console.log(data)

    setMessages([...messages, data]);
  }

//--------------------------------------------------------------------------------------------------------------------------------

  // FOR FILE UPLOADS

  // 1) WHEN FILE IS UPLOADED, IMAGE IS SET
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setFile(file)
    console.log(file)

  }

  // 2) ONCE FILE IS SET, USEEFFECT TRIGGERS UPLOAD FILE
  useEffect(() => {
    if (file) {
      uploadFile();
    }
  }, [file]);  // Runs uploadFile whenever file changes


  
  // 3) UPLOAD IMAGE UPLOADS IT TO AWS, THEN WE GET IT BACK FOR DISPLAY, AND SEND THE IMAGE AS A MESSAGE
  const uploadFile = async () => {
    setUploading(true)
    const S3_BUCKET = "discourse-file-bucket"
    const filename = file.name

    const s3 = new S3({
      params: { Bucket: S3_BUCKET },
      region: REGION,
    });

    const params = {
      Bucket: S3_BUCKET,
      Key: filename,  // name for the file
      Body: file,                                    // the file itself
    };

    try {
      const upload = await s3.putObject(params).promise();
      console.log("UPLOADED DATA" + upload);
      setUploading(false)
      alert("File uploaded successfully.");

      const url = s3.getSignedUrl('getObject', {
        Bucket: S3_BUCKET,
        Key: filename
      })
      console.log(url)

      sendFile(url,filename)

    } catch (error) {
      console.error(error);
      setUploading(false)
      alert("Error uploading file: " + error.message); // Inform user about the error
    }
  };

  // 4) MESSAGE IS NOW SENT AS AN FILE
  const sendFile = async (url,filename) => {
    
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    };
    setNewMessage("");

    const { data } = await axios.post(
      "/api/message",
      {
        content: filename,
        messageType: "file",
        url : url,
        chatId: selectedChat._id,
      },
      config
    );

    console.log(data)

    setMessages([...messages, data]);
  }

  return (
    <>
      {selectedChat ? (

        <div id="single-chat">
          {messages &&
          (!selectedChat.isGroupChat ? (
            // flex item 1 - chat/ group chat name
            
              <div onClick={() => setModal(true)} className="domine-regular" >{getSender(user, selectedChat.users)}</div>
              
            
          ) : (
            // flex item 1 - chat/ group chat name
            
              <div onClick={() => setModal(true)} className="domine-regular"> {selectedChat.chatName.toUpperCase()}</div>
              
            
          ))}

          
            <Box display="flex" flexDir="column" justifyContent="flex-end" p={0} bg="#092856;" w="100%" h="100%" borderRadius="lg" overflowY="hidden" >
              {loading ? 
              (<Spinner size="l" w={20} h={20} alignSelf="center" margin="auto"/>) : 
              (
              <div className="messages">
                <ScrollableChat messages={messages}/>
              </div>
              )
            }
              {isTyping ? (<div style={{fontSize: "30px"}}> ... </div>) : (<></>)}
              {attachment &&
                  (<div className="attachment">

                    {/* UPLOAD IMAGE */}
                    {/* <Tooltip label={"Add Image"} placement="top-start" hasArrow>
                        <div className="attachment-item upload-btn-wrapper">
                          <button className=""><i class="fa-solid fa-image"></i></button>
                          <input type="file" onChange={handleImageChange} name="picture" accept="image/png, image/jpeg" />
                          
                      </div>
                    </Tooltip> */}

                    {/* UPLOAD FILE */}
                    <Tooltip label={"Add File"} placement="top-start" hasArrow>
                      <div className="attachment-item upload-btn-wrapper">
                        <button className=""><i class="fa-solid fa-file"></i></button>
                        <input type="file" onChange={handleFileChange} name="myfile" accept="application/pdf"/>
                      </div>

                    {/* UPLOAD AUDIO */}
                    </Tooltip>

                    {isRecording ? 
                    (
                      <Tooltip label={"Add Audio"} placement="top-start" hasArrow>
                        <div onClick={stopRecording} className="attachment-item"><i class="fa-solid fa-microphone-slash"></i></div>
                      </Tooltip>
                    ) : 
                    (
                      <Tooltip label={"Add Audio"} placement="top-start" hasArrow>
                      <div onClick={startRecording} className="attachment-item"><i class="fa-solid fa-microphone"></i></div>
                    </Tooltip>
                    )}
                    
                    
                  </div>)
                  
                }
              <FormControl className="message-input" onKeyDown={sendMessage} id="first-name" isRequired mt={3}> 
                
                <Input variant="filled"bg="#E0E0E0" placeholder="Enter a message.." value={newMessage} onChange={typingHandler}/>
                <Tooltip label={"Add Attachment"} placement="bottom-start" hasArrow><div className="attachment-item" style={{fontSize:"30px"}} onClick={() => setAttachment(!attachment)}><i class="fa-solid fa-paperclip"></i></div></Tooltip>
                <Tooltip label={"Add Emoji"} placement="bottom-start" hasArrow><div className="attachment-item" style={{fontSize:"30px"}} onClick={() => setAttachment(!attachment)}><i class="fa-solid fa-face-smile"></i></div></Tooltip>
                
              </FormControl>
            </Box>
          </div>
      ) : (
        // to get socket.io on same page
        <div></div>
      )}
    </>
  );
};

export default SingleChat;