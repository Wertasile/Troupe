import React, { useEffect, useState} from 'react'
import { NavLink } from 'react-router-dom/cjs/react-router-dom'
import { useHistory, Link } from 'react-router-dom/cjs/react-router-dom.min'
import FAQs from '../components/miscallaneous/FAQs.json'

const Homepage = () => {
    const [expand, setExpand] = useState(new Set())
    const history = useHistory()

    const toggleExpand = (index) => {
        setExpand(prev => {
            const copySet = new Set(prev)

            if (copySet.has(index)){
                copySet.delete(index)
            } else {
                copySet.add(index)
            }
            return copySet
        })
    }
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userInfo"))

        if (user){
            history.push("/chats")  // if user is already logged in, push him back to chats page
        }
    }, [history])

    return (
        <>
            <header>
                <div style={{display:'flex'}}><img src='/images/Troupe_Logo.png' width="40"/></div>
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
                    <div className='price-cards'>
                        <div>
                            <h1>Pricing plans, for everyone!</h1>
                            <p>Well, this is here just to say that this application is completely free!</p>
                        </div>
                        <div className='card'>
                            <h2>For Individuals, Start for free</h2>
                            <div>Get access to:</div>
                            <ul>
                                <li><i class="fa-solid fa-circle-check" style={{color: '#B197FC'}}></i> DMs and Group Chats</li>
                                <li><i class="fa-solid fa-circle-check" style={{color: '#B197FC'}}></i> Multimedia sharing</li>
                                <li><i class="fa-solid fa-circle-check" style={{color: '#B197FC'}}></i> Voice messaging</li>
                            </ul>
                            <NavLink to="login" className="primary-btn" style={{width:'200px'}}>Start Building</NavLink>
                        </div>
                        <div className='card'>
                            <h2>Enterprise</h2>
                            <h1>Pricing plans based on use</h1>
                            <div>
                                Upgrade as per your requirements. Be selective, for the features that you want, that you pay for. More support, More features and much much More.
                            </div>
                            <NavLink to="login" className="primary-btn" style={{width:'200px'}}>Start Building</NavLink>
                            
                        </div>

                    </div>
                </section>

                <section id="FAQs">
                    <div style={{alignItems:'left'}}>
                        <h1>FAQs</h1>
                        {FAQs.map((FAQ, index) => 
                            (<div style={{borderBottom:'0.5px gray solid', padding:'10px'}}>
                                <div onClick={() => {toggleExpand(index)}} key={index} >
                                    <h2>{FAQ.title} {expand.has(index) ? (<i class="fa-solid fa-chevron-down"></i>) :(<i class="fa-solid fa-chevron-up"></i>)} </h2>
                                </div>
                                <div>
                                    {expand.has(index) && <div>{FAQ.desc}</div>}
                                </div>
                            </div>) 
                        )}
                    </div>
                    
                </section>
            </main>

            <footer>
                <div id='footer-left'>
                    <div style={{display:'flex', alignItems:'center'}}><img src='/images/Troupe_Logo.png' width="48"/><span> <h2>TROUPE</h2></span></div>
                    <div style={{textAlign:'justify'}}>Troupe is basically a texting platform in its base. It is supported by features, mainly multimedia which provides a way to share things through multiple means.</div>
                    <div style={{display:'flex', gap:"10px"}}>
                        <i class="fa-brands fa-discord"></i>
                        <i class="fa-brands fa-github"></i>
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