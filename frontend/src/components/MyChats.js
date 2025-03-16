import { Avatar, Box, Stack, Text, Tooltip } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { getSender } from "../config/ChatLogics";
import ChatLoading from "./ChatLoading";
import { ChatState } from "../Context/ChatProvider";
import GCModal from "./miscallaneous/GCModal";
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import ChatModal from "./miscallaneous/ChatModal";
import ProfileModal from "./miscallaneous/ProfileModal";

const MyChats = ({ fetchAgain}) => {
  const [loggedUser, setLoggedUser] = useState();
  const [gcModal, setGcModal] = useState(false)
  const [scModal, setScModal] = useState(false)
  const [profileModal, setProfileModal] = useState(false)

  const toast = useToast();
  const history = useHistory()
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const fetchChats = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toast({title: "Error Occured!", description: "Failed to Load the chats", status: "error", duration: 5000, isClosable: true,position: "bottom-left",});
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  const logoutHandler = () => {
    localStorage.removeItem("userInfo")
    history.push("/")
  }

  return (
    <>
      {gcModal ? (
        <div class="gc-modal">

        <GCModal setGcModal={setGcModal}/>
      
        </div>
      ) : (<div></div>)}

      {scModal ? (
        <div class="gc-modal">

        <ChatModal/>
      
        </div>
      ) : (<div></div>)}

      {profileModal ? (
        <div class="gc-modal">

        <ProfileModal user={user}/>
      
        </div>
      ) : (<div></div>)}

      <div id="my-chats-component">
        <div>
          
          <div className="profile-section" onClick={() => setProfileModal(true)}>
            <Tooltip label={user.name} placement="bottom-start" hasArrow><div style={{justifySelf:"center"}}><Avatar size="sm" cursor="pointer" name={user.name} src={user.pic}/></div></Tooltip>
            
            <Tooltip label={"Logout"} placement="bottom-start" hasArrow><div><button onClick={logoutHandler} className="attachment-item"><i class="fa-solid fa-right-from-bracket"></i></button></div></Tooltip>
            
          </div>
          <div className="profile-section">
            <input className="input-decor" placeholder="Find or start a conversation" onClick={() => {setScModal(true)}}/>
            <Tooltip label={"Create Group Chat"} placement="bottom-start" hasArrow><div><button className="attachment-item" onClick={() => {setGcModal(true)}}><i class="fa-solid fa-plus"></i></button></div></Tooltip>
          </div>
          
          
          
        </div>
        {/* flex item 1 : all chats */}
        
            {chats ? (
              <div className="all-chats">
                {chats.map((chat) => (
                  <div className="all-chats-item" onClick={() => setSelectedChat(chat)} key={chat._id}>
                    
                      {!chat.isGroupChat
                        ? getSender(loggedUser, chat.users)
                        : chat.chatName}

                  </div>
                ))}
              </div>
            ) : (
              <ChatLoading />
            )}
          
          
        

        
            
            
        

          
        
        
        
      </div>
      
    </>
    
  );
};

export default MyChats;