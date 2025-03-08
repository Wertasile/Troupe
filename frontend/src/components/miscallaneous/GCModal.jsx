import React, { useState } from 'react'
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Button, useToast, FormControl, Input, Box,} from '@chakra-ui/react'
import { Toast } from '@chakra-ui/react'
import { ChatState } from '../../Context/ChatProvider'
import axios from 'axios'
import UserListItem from '../userAvatar/UserListItem'
import UserBadgeItem from '../userAvatar/UserBadgeItem'
import ChatLoading from '../ChatLoading'



const GCModal = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    
    const [groupChatName, setGroupChatName] = useState()
    const [selectedUsers, setSelectedUsers] = useState([])
    const [search, setSearch] = useState()
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)

    const toast = useToast()

    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)){
            toast({title: "User already selected",status: "warning",duration: 5000,isClosable: true,position: "top-left",});
            return
        }

        setSelectedUsers([...selectedUsers, userToAdd])  // add user to the selectedUsers array

    }

    const handleDelete = (delUser) => {
        setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
      };

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

    const handleSubmit = async() => {
        if (!groupChatName || !selectedUsers){
            toast({title: "Error Occured",description: "PLEASE FILL ALL FIELDS",status: "error",duration: 5000,isClosable: true,position: "top-left",});
        }

        try {
            const config = {
                headers : {
                    Authorization : `Bearer ${user.token}`
                }
            }

            const data = await axios.post("/api/chat/group", 
                {
                    name : groupChatName, 
                    users : JSON.stringify(selectedUsers.map((u) => (u._id)))
                }
                ,config)

            setChats([data, ...chats])
            onClose()

            toast({title: "New Group Chat Created",status: "success",duration: 5000,isClosable: true,position: "top-left",});
        } catch (error) {
            
        }
    }

    const { user, chats, setChats } = ChatState()

  return (
    <>
        <div className='gc-modal-content'>
            <div className='domine-regular'>Create a new Group Chat</div>
            <input className="input-decor" placeholder='enter group chat name' onChange={(e) => setGroupChatName(e.target.value)}/>
            <input className="input-decor" placeholder='enter group user name' onChange={(e) => handleSearch(e.target.value)}/>
            {/* BELOW IS SELECTED GROUP MEMBERS*/}
            <div style={{display:'flex'}}>
                {selectedUsers.map((u) => (
                    <UserBadgeItem key={u._id} user={u} handleFunction={() => handleDelete(u)} />
                ))}
            </div>

            {/* BELOW IS USER SEARCH SUGGESTION FOR GROUP MEMBERS*/}
        
            {loading ? (
            <div>LOADING...</div>
            ) : (
            <div className='user-search-results'>
                {searchResult
                ?.slice(0, 4)
                .map((user) => (
                <div><UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)}/></div>
                ))}
            </div>
            
            )}
            
            
            <button type="button" className="primary-btn" onClick={handleSubmit}>CREATE</button>

    </div>
    </>
    
  )
}

export default GCModal