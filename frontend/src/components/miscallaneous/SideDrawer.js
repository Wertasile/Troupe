import { Box, Tooltip, Button, Text, Menu, MenuButton, Avatar, MenuList, MenuItem, MenuDivider, useDisclosure, Input, Toast, useToast, Spinner } from '@chakra-ui/react'
import { BellIcon, ChevronDownIcon} from "@chakra-ui/icons"
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider'
import ProfileModal from './ProfileModal'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
  } from '@chakra-ui/react'
import axios from 'axios'
import ChatLoading from '../ChatLoading'
import UserListItem from '../userAvatar/UserListItem'
import { getSender } from '../../config/ChatLogics'

import { Notification } from "react-notification-badge"

const SideDrawer = () => {

    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingChat, setLoadingChat] = useState()

    const { user, setSelectedChat, chats, setChats, notification, setNotification } = ChatState()
    const history = useHistory()
    const toast = useToast()

    const logoutHandler = () => {
        localStorage.removeItem("userInfo")
        history.push("/")
    }

    const handleSearch = async () => {
        if (!search) {
          toast({
            title: "Please Enter something in search",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "top-left",
          });
          return;
        }
    
        try {
          setLoading(true);
    
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
    
          const { data } = await axios.get(`/api/user?search=${search}`, config);
    
          setLoading(false);
          setSearchResult(data);
        } catch (error) {
          toast({
            title: "Error Occured!",
            description: "Failed to Load the Search Results",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
          });
        }
      };

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
            toast({
                title: "Error Fetching Chat!",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
              });
        }
    }

    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
            <Box display="flex" background="white" alignItems="center" justifyContent="space-between" w="100%" p="5px 10px 5px 10px" borderWidth="5px">
                <Tooltip label="Search users to Chat" hasArrow placement="bottom-end">
                    <Button variant="ghost" onClick={onOpen}>
                        <i class="fa-solid fa-magnifying-glass"></i>
                        <Text d={{base : "none", md : "flex"}} px="4">Search User</Text>
                    </Button>
                </Tooltip>

                <Text fontSize="2xl" fontFamily="cursive">TALK-A-TIVE</Text>

                <div>
                    <Menu>
                        <MenuButton p={1}>
                            
                            <BellIcon fontSize="2xl" m={1} color={ notification.length > 0 ? "red" : "gray"}></BellIcon>
                        </MenuButton>
                        <MenuList pl={2}>
                            {/* If notifications are not there, then notification menu must display no new messages */}
                            {!notification.length && "No new messages"}

                            {/* If notifications are there*/}
                            {notification.map((notif) => (
                                <MenuItem 
                                    key={notif._id} 
                                    onClick={() => {
                                        setSelectedChat(notif.chat)  // once we click on the notification message, we go to the notification's chat
                                        setNotification(notification.filter((n) => n !== notif)) // we filter out the notification we have clicked on
                                    }}>
                                    {notif.chat.isGroupChat ? `New Message in ${notif.chat.chatName}` : `New Message from ${getSender(user, notif.chat.users)}`}
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>

                    <Menu>
                        <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
                            <Avatar
                            size="sm"
                            cursor="pointer"
                            name={user.name}
                            src={user.pic}
                        />
                        </MenuButton>
                        <MenuList>
                        <ProfileModal user={user}>
                            <MenuItem>My Profile</MenuItem>{" "}
                        </ProfileModal>
                        <MenuDivider />
                        <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>

            <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
                <DrawerBody>
                    <Box d="flex" pb={2}>
                    <Input
                        placeholder="Search by name or email"
                        mr={2}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <Button onClick={handleSearch}>Go</Button>
                    </Box>
                    {loading ? (
                    <ChatLoading />
                    ) : (
                    searchResult?.map((user) => (
                        <UserListItem
                        key={user._id}
                        user={user}
                        handleFunction={() => accessChat(user._id)}
                        />
                    ))
                    )}
                    
                    {loadingChat && < Spinner ml="auto" display="flex"/>}
                </DrawerBody>
                </DrawerContent>
            </Drawer>

        </>
        
    )
}

export default SideDrawer