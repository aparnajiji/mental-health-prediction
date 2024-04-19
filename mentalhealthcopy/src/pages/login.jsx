import React, { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { doSignInWithEmailAndPassword } from '../firebase/auth'
import { useAuth } from '../context/'
import './auth.css'
import yoga from '../assets/yoga.png'

const Login = () => {
    const { userLoggedIn } = useAuth()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSigningIn, setIsSigningIn] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const onSubmit = async (e) => {
        e.preventDefault()
        if (!isSigningIn) {
            try {
                await doSignInWithEmailAndPassword(email, password);
            } catch (error) {
                console.error("Sign-in error:", error.message);
                alert("Sign-in unsuccessful. Please check your email and password.");
            } finally {
                setIsSigningIn(false);
            }
        }
    }

    return (
        <div class="parent">
            {userLoggedIn && (<Navigate to={'/home'} replace={true} />)}

            <div class="child">
                <div class="left">
                    <h3>Hello 👋</h3>
                    <br />
                    <h4>Enter your details to <strong class="red">Login
                    </strong> </h4>
                    <br />
                    <br />
                    <div class="question">
                        <form onSubmit={onSubmit}>

                            <div class="form-question">
                                <input type="text" placeholder="Email" id="" required onChange={(e) => { setEmail(e.target.value) }} />
                                <input type="text" placeholder="Password" id="" required onChange={(e) => { setPassword(e.target.value) }} />
                            </div>
                            <div class="buttons">
                                <button>Log In</button>

                            </div>
                        </form>
                        <br />
                        <div class="buttons">
                            <Link to={'/register'}> <button className="btn btn-success">
                                Create account
                            </button></Link>
                        </div>

                    </div>

                </div>
                <div class="right">
                    <img src={yoga} />
                </div>
            </div>
        </div >

    )
}

export default Login