import React, { useState } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/'
import { doCreateUserWithEmailAndPassword } from '../firebase/auth'
import './auth.css'
import yoga from '../assets/yoga.png'
const Register = () => {

    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [confirmPassword, setconfirmPassword] = useState('')
    const [isRegistering, setIsRegistering] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const { userLoggedIn } = useAuth()

    const onSubmit = async (e) => {
        e.preventDefault()
        if (!isRegistering) {
            setIsRegistering(true)
            await doCreateUserWithEmailAndPassword(email, password)
        }
    }

    return (
        <>
            {userLoggedIn && (<Navigate to={'/home'} replace={true} />)}
            <div class="parent">

                <div class="child">
                    <div class="left">
                        <h3>Hello 👋</h3>
                        <h4>Enter your details to <strong class="red">Signup
                        </strong> </h4>

                        <div class="question">
                            <form onSubmit={onSubmit}>

                                <div class="form-question">
                                    <input type="text" placeholder="Username" id="" required onChange={(e) => { setName(e.target.value) }} />
                                    <input type="text" placeholder="Email" id="" required onChange={(e) => { setEmail(e.target.value) }} />
                                    <input type="text" placeholder="Password" id="" required onChange={(e) => { setPassword(e.target.value) }} />
                                    <input type="text" placeholder="Confirm Password" id="" />
                                </div>
                                <div class="buttons">
                                    <button type='submit'>Sign Up </button>
                                </div>
                            </form>

                        </div>
                        <div class="buttons">
                            <Link to={'/login'}> <button className="btn btn-success">
                                Already a user?
                            </button></Link>
                        </div>

                    </div>

                    <div class="right">
                        <img src={yoga} />
                    </div>
                </div>
            </div >

        </>
    )
}

export default Register