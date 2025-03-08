import { Box } from "@chakra-ui/react";
import { useState } from "react";
import Chatbox from "../components/ChatBox";
import SingleChat from "../components/SingleChat";
import MyChats from "../components/MyChats";
import SideDrawer from "../components/miscallaneous/SideDrawer";
import { ChatState } from "../Context/ChatProvider";
import ProfileModal from "../components/miscallaneous/ProfileModal.jsx";
import { getSender, getSenderFullDetails } from "../config/ChatLogics";

const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const [modal,setModal] = useState(false);
  const { selectedChat, setSelectedChat, user, notification, setNotification } = ChatState();

  return (
    <div>
      {modal ? (<div className="gc-modal"><ProfileModal user={getSenderFullDetails(user, selectedChat.users)}/></div>) : (<div></div>)}
      <div className="chat-page">
      {/* {user && <SideDrawer />} */}
      
        
      
      <div>{user && <MyChats fetchAgain={fetchAgain} />}</div>
      <div>
        
        {user && (
          // <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}  modal={modal} setModal={setModal}/>
        )}
      </div>
    </div>
    </div>
    
  );
};

export default Chatpage;