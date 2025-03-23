import React, { useState } from 'react'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Button, useToast, FormControl, Input, Box,} from '@chakra-ui/react'
import { Toast } from '@chakra-ui/react'
import { ChatState } from '../../Context/ChatProvider'
import axios from 'axios'
import UserListItem from '../userAvatar/UserListItem'




const ChatModal = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    
    const [groupChatName, setGroupChatName] = useState()
    const [selectedUsers, setSelectedUsers] = useState([])
    const [search, setSearch] = useState()
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingChat, setLoadingChat] = useState()

    const { user, setSelectedChat, chats, setChats, notification, setNotification } = ChatState()
    const toast = useToast()

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true)
            const config = {
                headers: {
                  "Content-type" : "application/json",   // because we are sending some JSON data
                  Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post("/api/chat",{ userId }, config)

            // appends a new chat to existing chat if the chat does not exists and is not part of data
            if (!chats.find((c) => c._id === data._id)){
                setChats([data,...chats])
            }

            setSelectedChat(data)
            setLoadingChat(false)
            onClose()  // close drawer
        } catch (error) {
            toast({ title: "Error Fetching Chat!", description: error.message, status: "error", duration: 5000, isClosable: true, position: "bottom-left",});
        }
    }

    const handleSearch = async (query) => {
        setSearch(query)

        if (!query) return

        try {
            setLoading(true)

            const config = {
                headers : {
                    Authorization : `Bearer ${user.token}`
                }
            }

            const { data } = await axios.get(`/api/user?search=${search}`, config)
            //console.log(data)
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast({title: "Error Occured",description: "Failed to Load Search Results",status: "error",duration: 5000,isClosable: true,position: "top-left",});
              return;
        }
    }

  return (
    <>
        <div className='gc-modal-content'>
            <div className='domine-regular'>Who would you like to talk to?</div>
            <input className="input-decor" placeholder='enter user to start chat with' onChange={(e) => handleSearch(e.target.value)}/>

            {/* BELOW IS USER SEARCH SUGGESTION FOR GROUP MEMBERS*/}
        
            {loading ? (
            <div>LOADING...</div>
            ) : (
            <div className='user-search-results'>
                {searchResult
                ?.slice(0, 4)
                .map((user) => (
                <div><UserListItem key={user._id} user={user} handleFunction={() => accessChat(user._id)}/></div>
                ))}
            </div>
            
            )}

    </div>
    </>
    
  )
}

export default ChatModal