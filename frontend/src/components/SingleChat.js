
import { IconButton, Spinner, useToast, Box, Text, Input, FormControl } from "@chakra-ui/react";
import { getSender, getSenderFullDetails } from "../config/ChatLogics";
import { useEffect, useState } from "react";
import axios from "axios";
import "./styles.css"
import { ArrowBackIcon } from "@chakra-ui/icons";
import ProfileModal from "./miscallaneous/ProfileModal";


import UpdateGroupChatModal from "./miscallaneous/UpdateGroupChatModal";
import { ChatState } from "../Context/ChatProvider";
import ScrollableChat from "./ScrollableChat";

import io from "socket.io-client"
// socket io stuff below
// const ENDPOINT = "http://localhost:5000"
const ENDPOINT = "https://real-time-chat-app-mern-un4z.onrender.com"
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain, modal, setModal  }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");


  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // state for real; time message socket
  const [socketConnected, setSocketConnected] = useState(false)

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

      console.table(messages)
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



  const sendMessage = async (event) => {
    
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
            chatId: selectedChat._id,
          },
          config
        );

        // emitting the new message (data from API call)
        socket.emit("new message", data)

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

  return (
    <>
      {selectedChat ? (

        <div id="single-chat">
          {messages &&
          (!selectedChat.isGroupChat ? (
            // flex item 1 - chat/ group chat name
            <div>
              <div onClick={() => setModal(true)} className="domine-regular" >{getSender(user, selectedChat.users)}</div>
              
            </div>
          ) : (
            // flex item 1 - chat/ group chat name
            <div>
              <div onClick={() => setModal(true)} className="domine-regular"> {selectedChat.chatName.toUpperCase()}</div>
              {/* <UpdateGroupChatModal
                fetchMessages={fetchMessages}
                fetchAgain={fetchAgain}
                setFetchAgain={setFetchAgain}
              /> */}
            </div>
          ))}

          
            <Box display="flex" flexDir="column" justifyContent="flex-end" p={3} bg="#092856;" w="100%" h="90%" borderRadius="lg" overflowY="hidden" >
              {loading ? 
              (<Spinner size="l" w={20} h={20} alignSelf="center" margin="auto"/>) : 
              (
              <div className="messages">
                <ScrollableChat messages={messages}/>
              </div>
              )
            }

              <FormControl onKeyDown={sendMessage} id="first-name" isRequired mt={3}> 
                {isTyping ? (<div style={{fontSize: "30px"}}> ... </div>) : (<></>)}
                <Input variant="filled"bg="#E0E0E0" placeholder="Enter a message.." value={newMessage} onChange={typingHandler}/>
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