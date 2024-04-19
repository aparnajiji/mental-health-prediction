import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../home.css'
import { doSignOut } from '../firebase/auth'
import { useAuth } from '../context'

const Header = () => {
    const navigate = useNavigate()
    const { currentUser } = useAuth()

    const onLogout = async (e) => {
        e.preventDefault()
        await doSignOut();
    }
    const { userLoggedIn } = useAuth()

    return (
        <nav>
            <div class="navleft">Mental Health</div>
            <div class="navright">
                <ul>
                    <Link to={'/'}>  <li>
                        <h5>Home</h5>
                    </li></Link>

                    {userLoggedIn ? <li onClick={onLogout}>Logout</li> : ''}
                </ul>

            </div>
        </nav>
    )
}

export default Header