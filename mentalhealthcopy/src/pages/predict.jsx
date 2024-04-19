import React, { useContext, useEffect, useState } from 'react'
import { doc, getDoc } from "firebase/firestore";
import '../home.css'
import { signOut } from "firebase/auth";
import yoga from '../assets/yoga.png';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Prediction(props) {
    const location = useLocation();
    const data = location.state;
    const navigate = useNavigate();
    const [res, setRes] = useState(data.res.data['class'][0]);
    const [score, setScore] = useState(data.res.data['score']);
    console.log("data.res")
    console.log(data.res.data['class'])

    const home = () => {
        navigate('/')
    }

    return (
        <>
            <div className="parent">

                <div className="child">
                    <div className="left">
                        <h3>Hello 👋</h3>
                        <br />
                        <h4>Your responses show that you are<strong className="red">{res == '0' ? 'Okay' : 'Not Okay'}</strong></h4>
                        <br />
                        <h4>Your score is<strong className="red">{score}</strong></h4>

                        <br />
                        {score <= 31 && " You are perfectly fine. Keep it up"}
                        {score <= 33 && score > 31 && "You are on the right track. Reduce screen time and stay active"}
                        {score == 34 && "You are on the right track. With a little more effort you can feel more awesome"}
                        {score == 35 && "You seem tensed. Try to be more socially active and spend time in nature"}
                        {score > 35 && "It's always a good idea to seek consultation"}

                        <br />
                        <br />
                        <h5>If your score is above 34, then please consider taking medical help.</h5>
                        <br />

                        <div class="buttons">
                            <button onClick={home}>Try again</button>

                        </div>
                    </div>
                    <div class="right">
                        <img src={yoga} alt="" srcset="" />
                    </div>
                </div>
            </div>



        </>

    )
}
