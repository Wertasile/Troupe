import React, { useEffect, useState} from 'react'
import { NavLink } from 'react-router-dom/cjs/react-router-dom'
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
            <header>
                <img src='/images/Troupe_Logo.png' height={32}/>
                <nav>

                </nav>
                <NavLink to="/login">LOGIN</NavLink>
            </header>

            <main>
                <section id="hero">

                </section>
                <section>
                    
                </section>
                <section>
                    
                </section>
            </main>

            <footer>

            </footer>
        </>
    )
}

export default Homepage