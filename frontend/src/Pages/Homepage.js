import { Box, Center, Container, Text, TabList, Tab, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import Login from '../components/Authentication/Login'
import Signup from '../components/Authentication/Signup'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'

const Homepage = () => {

    const history = useHistory()

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userInfo"))

        if (user){
            history.push("/chats")  // if user is already logged in, push him back to chats page
        }
    }, [history])

    return (
        <Container maxW="xl" centerContent>

            <Box d="flex" justifyContent="center" p={3} bg={"white"} w="100%" m="40px 0 15px 0" borderRadius="lg" borderWidth="1px">                                       {/* kinda live a div */}
                <Center fontSize="4xl" fontFamily="Work sans" color="black">
                    Talk-A-Tive
                </Center>
            </Box>

            <Box bg={"white"} p={3} w="100%" borderRadius="lg" color="black" borderWidth="1px">
            <Tabs variant='soft-rounded'>
                <TabList mb="1em">
                    <Tab width="50%">LOGIN</Tab>
                    <Tab width="50%">SIGN-UP</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <Login/>
                    </TabPanel>
                    <TabPanel>
                        <Signup/>
                    </TabPanel>
                </TabPanels>
            </Tabs>
            </Box>


        </Container>
    )
}

export default Homepage