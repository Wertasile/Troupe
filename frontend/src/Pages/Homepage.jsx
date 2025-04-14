'use client'

import React, { useEffect, useState} from 'react'
import { useHistory, Link } from 'react-router-dom/cjs/react-router-dom.min'

const Homepage = () => {
    const history = useHistory()

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userInfo"))

        if (user){
            history.push("/chats")  // if user is already logged in, push him back to chats page
        }
    }, [history])

    return (
        <>
            <div className='login-bar'>
                <div className='domine-regular'>
                    {/* <img src="/images/discourse-logo.png" height="10" alt="Discourse Logo" /> */}
                    TROUPE
                </div>
                <div className='login-bar-items'>
                    <div>Download</div>
                    <div>Blog</div>
                    <div>Developer</div>
                    <div>Careers</div>
                    <div><Link to="/login"><div>Login</div></Link></div>
                </div>
            </div>
        </>
    )
}

export default Homepage