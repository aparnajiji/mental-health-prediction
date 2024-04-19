import React, { useContext, useEffect, useState } from 'react'
import { doc, getDoc } from "firebase/firestore";
import '../home.css'
import yoga from '../assets/yoga.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context';

export default function Home() {
    const { userLoggedIn } = useAuth()


    const questions = [
        {
            question: 'Gender',
            options: ['Male', 'Female'],
            // values: [1, 0],
        },
        {
            question: 'Are you above 30 years of age?',
            options: ['Yes', 'No'],
            // values: [1, 0],
        },
        {
            question: 'Employment Status',
            options: ['Employed', 'Student'],
            // values: [1, 0],
        },
        {
            question: "Your city?",
            options: [
                'Tier 1 (Delhi, Mumbai, Bangalore, Chennai, Kolkata)',
                'Tier 2 (Capital cities Eg. Lucknow )',
                'Tier 3 (Other cities/towns)'
            ],
            // values: [
            //     'Tier 1 (Delhi, Mumbai, Bangalore, Chennai, Kolkata)',
            //     'Tier 2 (Capital cities Eg. Lucknow )',
            //     'Tier 3 (Other cities/towns)'
            // ],
        },

        {
            question: "How are you feeling today?",
            options: [
                'Good',
                'Fine',
                'Sad',
                'Depressed'
            ],
            // values: [
            //     'Good',
            //     'Fine',
            //     'Sad',
            //     'Depressed'
            // ],
        },

        {
            question: "Eating and sleeping on time?",
            options: [
                'Yes',
                'No',
                'Maybe',
            ],
            // values: [
            //     'Yes',
            //     'No',
            //     'Maybe',
            // ],
        },

        {
            question: "Is your sadness momentarily or has it been constant for a long time?",
            options: [
                'For some time',
                'Not sad',
                'Significant time',
                'Long time',
            ],
            // values: [
            //     'For some time',
            //     'Not sad',
            //     'Significant time',
            //     'Long time',
            // ],
        },

        {
            question: "At what time of the day are you extremely low?",
            options: [
                'Evening',
                'Afternoon',
                'Morning',
            ],
            // values: [
            //     'Evening',
            //     'Afternoon',
            //     'Morning',
            // ],
        },
        {
            question: "Has there been a sudden and huge change in your life?",
            options: [
                'No',
                'Yes',
                'Not sure',
            ],
            // values: [
            //     'No',
            //     'Yes',
            //     'Not sure',
            // ],
        },
        {
            question: "Your stress is related to which of the following areas?",
            options: [
                'Personal',
                'Work',
                'Home, Personal',
                'Work, Personal',
                'Home, Work, Personal',
                'Financial',
                'Home, Work, Financial, Personal',
                'Financial, Personal',
                'Home',
                'Work, Financial',
                'Home, Work',
            ],
            // values: [
            //     'Personal',
            //     'Work',
            //     'Home, Personal',
            //     'Work, Personal',
            //     'Home, Work, Personal',
            //     'Financial',
            //     'Home, Work, Financial, Personal',
            //     'Financial, Personal',
            //     'Home',
            //     'Work, Financial',
            //     'Home, Work',
            // ],
        },
        {
            question: "How frequently have you had little pleasure or interest in the activities you usually enjoy?",
            options: [
                'Sometimes',
                'Often',
                'Very Often',
                'Never',
            ],
            // values: [
            //     'Sometimes',
            //     'Often',
            //     'Very Often',
            //     'Never',
            // ],
        },
        {
            question: "How confident you have been feeling in your capabilities recently?",
            options: [
                '5',
                '4',
                '3',
                '2',
                '1',
            ],
            // values: [
            //     4,
            //     3,
            //     5,
            //     2,
            //     1,
            // ],
        },
        {
            question: 'Describe how supported you feel by others around you (friends, family, or otherwise)',
            options: ['Not at all', 'Poor', 'Average', 'Little bit', 'Satisfactory', 'Highly supportive'],
            // values: [0, 4, 2, 1, 3, 5],
        },
        {
            question: "How frequently have you been doing things that mean something to you or your life?",
            options: [
                'Often',
                'Sometimes',
                'Very Often',
                'Never',
            ],
            // values: [
            //     'Often',
            //     'Sometimes',
            //     'Very Often',
            //     'Never',
            // ],
        },
        {
            question: "If you have a mental health condition, do you feel that it interferes with your work?",
            options: [
                'Yes',
                'No',
                'Maybe',
            ],
            // values: [
            //     'Yes',
            //     'No',
            //     'Maybe',
            // ],
        },
        {
            question: 'How easy is it for you to take medical leave for a mental health condition?',
            options: ['Difficult', 'Not so Easy', 'Easy', 'Very easy'],
            // values: [2, 1, 0],
        },
        {
            question: 'How often do you make use of substance abuse (e.g. smoking, alcohol)?',
            options: ['Sometimes', 'Never', 'often'],
            // values: [1, 0, 2],
        },
        {
            question: 'Having trouble concentrating on things, such as reading the newspaper or watching television, or studying?',
            options: ['Yes', 'No', 'Maybe'],
            // values: [2, 1, 0],
        },
    ];


    const navigate = useNavigate();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedValues, setSelectedValues] = useState(Array(questions.length).fill(0));


    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
        }
    };

    const handleSelectChange = (e) => {
        const updatedValues = [...selectedValues];
        updatedValues[currentQuestionIndex] = parseInt(e.target.value, 10);
        setSelectedValues(updatedValues);
        console.log(updatedValues[currentQuestionIndex])
    };


    const notify = () => toast("Wow so easy!");
    const handleSubmit = async () => {
        if (selectedValues.includes(null)) {
            console.log(selectedValues);
            alert('Fill All Fields');
            notify();
        } else {
            if (!(selectedValues.includes(null))) {
                console.log('calling')
                console.log(selectedValues)
                const data = {
                    selectedValues: selectedValues
                };
                fetch('http://127.0.0.1:5000/predict', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log('Prediction result:', data);
                        navigate('/predict', { state: { res: data } })
                    })
                    .catch(error => {
                        console.error('There was a problem with your fetch operation:', error);
                    });
            }
        }
        console.log('Submitted Values:', selectedValues);
    };

    const currentQuestion = questions[currentQuestionIndex];
    console.log(selectedValues[currentQuestionIndex])
    const isfilled = selectedValues[currentQuestionIndex] !== '';
    console.log(selectedValues[currentQuestionIndex])
    console.log(isfilled)

    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    return (
        <>

            {!userLoggedIn && (<Navigate to={'/login'} replace={true} />)}


            <div className="parent">

                <div className="child">
                    <div className="left">
                        <h3>Hello 👋</h3>
                        <br />
                        <h4>Let's have a <strong className="red">chat</strong></h4>
                        <br />
                        <br />
                        <div className="question">
                            <div className="form-question">
                                {currentQuestion && (
                                    <>
                                        <label htmlFor={currentQuestion.question}>
                                            {currentQuestion.question}
                                        </label>
                                        <br />
                                        <br />

                                        {/* {isfilled && <h2>✔️</h2>} */}

                                        <select
                                            name={currentQuestion.question}
                                            id={currentQuestion.question}
                                            required
                                            defaultValue={selectedValues[0]}
                                            value={selectedValues[currentQuestionIndex]}
                                            onChange={handleSelectChange}
                                        >
                                            <option disabled selected value>
                                                Select
                                            </option>
                                            {currentQuestion.options.map((option, index) => (
                                                <option key={index} value={index}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    </>
                                )}
                            </div>

                            <div className="buttons">
                                <button onClick={handlePreviousQuestion}>⏮️ Previous</button>
                                &nbsp;
                                &nbsp;
                                &nbsp;
                                {isLastQuestion ? (
                                    <button onClick={handleSubmit}>Submit</button>
                                ) : (
                                    <button onClick={handleNextQuestion}>Next ⏭️</button>
                                )}
                            </div>

                        </div>


                    </div>
                    <button>  {currentQuestionIndex + 1} out of {questions.length}
                    </button>
                    <div class="right">
                        <img src={yoga} alt="" srcset="" />
                    </div>
                </div>
            </div>



        </>

    )
}
