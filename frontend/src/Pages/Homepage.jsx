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
                <div style={{display:'flex'}}><img src='/images/Troupe_Logo.png' width="32"/><span>TROUPE</span></div>
                <nav>
                    <NavLink to="/login">Discover</NavLink>
                    <NavLink to="/login">Blog</NavLink>
                    <NavLink to="/login">Pricing</NavLink>
                    <NavLink to="/login">About</NavLink>
                </nav>
                <NavLink to="/login" className="primary-btn">LOGIN</NavLink>
            </header>

            <main>
                <section id="hero">
                    <div className='banner'>
                        <h1>Welcome to THE Communication Platform to</h1>
                        <h2>CHILL</h2>
                        <img src="images/hero-img.png" width={700}/>
                    </div>
                    
                </section>
                <section id='features'>
                    <div className='banner'>
                        <h1>Communicating through multiple means</h1>
                        <h2>Various ways to express yourself</h2>

                        <div className='feature_x'>
                            <img src="images/hero-img.png" width={500} style={{borderRadius:'8px'}}/>
                            <div className='feature_x_text'>
                                <h2>Chat with your mates, or your squad</h2>
                                <p>
                                    Wanna speak to your boys directly, DM 'em. Or wanna hangout with the boys like the good old days, can chat in groups for that!
                                </p>
                            </div>
                        </div>

                        <div className='feature_x'>
                            <div className='feature_x_text'>
                                <h2>Dont feel like texting, but gotta let your people know what's up?</h2>
                                <p>
                                    Hey, sometimes tacking away on the keyboard can be such a pain... Fret not, multimedia is a thing here so communicate via audio or images.
                                </p>
                            </div>
                            <img src="images/hero-img.png" width={500} style={{borderRadius:'8px'}}/>
                        </div>

                        <div className='feature_x'>
                            <div className='feature_x_text'>
                                <h2>Gotta get serious sometimes eh?</h2>
                                <p>
                                    Like we said, MULTIMEDIA. Send files, of ANY form. Gotta a spreadsheet for that, send that pronto and you good.
                                </p>
                            </div>
                            <img src="images/hero-img.png" width={500} style={{borderRadius:'8px'}}/>
                        </div>

                    </div>
                </section>
                <section id="pricing">
                    
                </section>
                <section id="FAQs">
                    
                </section>
            </main>

            <footer>
                <div id='footer-left'>
                    <div style={{display:'flex'}}><img src='/images/Troupe_Logo.png' width="48"/><span>TROUPE</span></div>
                    <div>Base44 is the AI-powered platform that lets users build fully functioning apps in minutes. Using nothing but natural language, Base44 enables anyone to turn their words into personal productivity apps, back-office tools, customer portals, or complete enterprise products that are ready to use, no integrations required.</div>
                    <div style={{display:'flex', gap:"10px"}}>
                        <i class="fa-brands fa-discord"></i>
                        <i class="fa-brands fa-linkedin-in"></i>
                        <i class="fa-solid fa-envelope"></i>
                        <i class="fa-solid fa-briefcase"></i>

                    </div>
                </div>
                <div id='footer-right'>
                    <div>
                        <ul>
                            <li style={{paddingBottom:'10px'}}><b>PRODUCT</b></li>
                            <li>Features</li>
                            <li>Pricing</li>
                            <li>About Developer</li>
                        </ul>
                    </div>
                    <div>
                        <ul>
                            <li style={{paddingBottom:'10px'}}><b>RESOURCES</b></li>
                            <li>Docs & FAQs</li>
                            <li>Community</li>
                        </ul>
                    </div>
                    <div>
                        <ul>
                            <li style={{paddingBottom:'10px'}}><b>LEGAL</b></li>
                            <li>Privacy Policy</li>
                            <li>Terms of Service</li>
                        </ul>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Homepage