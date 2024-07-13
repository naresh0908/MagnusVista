import React, { useState, useEffect } from 'react';
import './QuizComponent.css';

const questions = [
    {
        question: "What is Java?",
        type: "radio",
        choices: ["A programming language", "A coffee brand", "A type of dance", "A car model"],
        correct: 0
    },
    {
        question: "Which company developed Java?",
        type: "dropdown",
        choices: ["Microsoft", "Apple", "Sun Microsystems", "IBM"],
        correct: 2
    },
    {
        question: "Select the primitive data types in Java:",
        type: "checkbox",
        choices: ["int", "String", "boolean", "List"],
        correct: [0, 2]
    },
    {
        question: "What does JVM stand for?",
        type: "text",
        correct: "Java Virtual Machine"
    },
    {
        question: "Which of these is not a Java feature?",
        type: "radio",
        choices: ["Object-oriented", "Use of pointers", "Portable", "Dynamic"],
        correct: 1
    },
    {
        question: "Which keyword is used to define a subclass in Java?",
        type: "dropdown",
        choices: ["extends", "implements", "inherits", "subclass"],
        correct: 0
    },
    {
        question: "Which of the following is not a valid access modifier in Java?",
        type: "radio",
        choices: ["public", "private", "protected", "final"],
        correct: 3
    },
    {
        question: "What is the default value of a boolean variable in Java?",
        type: "radio",
        choices: ["true", "false", "0", "null"],
        correct: 1
    },
    {
        question: "Which method is used to start a thread in Java?",
        type: "dropdown",
        choices: ["run()", "execute()", "start()", "begin()"],
        correct: 2
    },
    {
        question: "Select all valid ways to create a String object in Java:",
        type: "checkbox",
        choices: ["new String()", "String literal", "String()", "new StringBuilder()"],
        correct: [0, 1]
    },
    {
        question: "What is the size of an int variable in Java?",
        type: "radio",
        choices: ["16 bits", "32 bits", "64 bits", "128 bits"],
        correct: 1
    },
    {
        question: "Which of the following is not a type of loop in Java?",
        type: "dropdown",
        choices: ["for", "while", "do-while", "repeat"],
        correct: 3
    },
    {
        question: "How many catch blocks can be associated with one try block in Java?",
        type: "text",
        correct: "multiple"
    },
    {
        question: "Which of the following is used to handle exceptions in Java?",
        type: "radio",
        choices: ["try", "catch", "finally", "All of the above"],
        correct: 3
    },
    {
        question: "Select the keywords used for synchronization in Java:",
        type: "checkbox",
        choices: ["synchronized", "volatile", "atomic", "transient"],
        correct: [0, 1]
    },
    {
        question: "What is the parent class of all classes in Java?",
        type: "text",
        correct: "Object"
    },
    {
        question: "Which package contains the String class?",
        type: "radio",
        choices: ["java.util", "java.io", "java.lang", "java.net"],
        correct: 2
    },
    {
        question: "Which of the following statements are true about interfaces in Java?",
        type: "checkbox",
        choices: ["Interfaces can contain method implementations.", "Interfaces can extend multiple interfaces.", "Interfaces can be instantiated.", "Interfaces can contain constants."],
        correct: [1, 3]
    },
    {
        question: "Which of these is a valid constructor for a class named 'Person'?",
        type: "dropdown",
        choices: ["Person()", "void Person()", "public void Person()", "None of the above"],
        correct: 0
    },
    {
        question: "What does the 'final' keyword mean when applied to a variable?",
        type: "radio",
        choices: ["The variable cannot be changed.", "The variable is thread-safe.", "The variable is private.", "The variable is volatile."],
        correct: 0
    }
];



const questionsPerPage = 5;

const QuizComponent = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [score, setScore] = useState(null);
    const [answers, setAnswers] = useState(new Array(questions.length).fill(null));
    const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes in seconds
    const [timer, setTimer] = useState(null);

    useEffect(() => {
        startTimer();
    }, []);

    useEffect(() => {
        if (timeRemaining <= 0) {
            clearInterval(timer);
            handleQuizCompletion();
        }
    }, [timeRemaining]);

    const startTimer = () => {
        setTimer(setInterval(() => {
            setTimeRemaining(prevTime => prevTime - 1);
        }, 1000));
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const showQuestions = () => {
        const start = currentPage * questionsPerPage;
        const end = start + questionsPerPage;
        return questions.slice(start, end).map((q, index) => (
            <div className="question" key={start + index}>
                <h3>{q.question}</h3>
                {renderQuestion(q, start + index)}
            </div>
        ));
    };

    const renderQuestion = (q, index) => {
        switch (q.type) {
            case 'radio':
                return q.choices.map((choice, i) => (
                    <label key={i} className="radio-container">
                        <input
                            type="radio"
                            name={`question${index}`}
                            value={i}
                            checked={answers[index] === i}
                            onChange={() => handleAnswerChange(index, i)}
                        />
                        <span className="radio-label">{choice}</span>
                    </label>
                ));
            case 'dropdown':
                return (
                    <select
                        name={`question${index}`}
                        value={answers[index] || ''}
                        onChange={(e) => handleAnswerChange(index, parseInt(e.target.value, 10))}
                    >
                        <option value="">Select an option</option>
                        {q.choices.map((choice, i) => (
                            <option key={i} value={i}>{choice}</option>
                        ))}
                    </select>
                );
            case 'checkbox':
                return q.choices.map((choice, i) => (
                    <label key={i} className="checkbox-container">
                        <input
                            type="checkbox"
                            name={`question${index}`}
                            value={i}
                            checked={answers[index] && answers[index].includes(i)}
                            onChange={(e) => handleCheckboxChange(index, i, e.target.checked)}
                        />
                        <span className="checkbox-label">{choice}</span>
                    </label>
                ));
            case 'text':
                return (
                    <input
                        type="text"
                        name={`question${index}`}
                        value={answers[index] || ''}
                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                    />
                );
            default:
                return null;
        }
    };

    const handleAnswerChange = (index, value) => {
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);
    };

    const handleCheckboxChange = (index, value, checked) => {
        const newAnswers = [...answers];
        if (!newAnswers[index]) {
            newAnswers[index] = [];
        }
        if (checked) {
            newAnswers[index].push(value);
        } else {
            newAnswers[index] = newAnswers[index].filter(v => v !== value);
        }
        setAnswers(newAnswers);
    };

    const prevPage = () => {
        if (currentPage > 0) {
            saveAnswers();
            setCurrentPage(currentPage - 1);
        }
    };

    const nextPage = () => {
        if ((currentPage + 1) * questionsPerPage < questions.length) {
            saveAnswers();
            setCurrentPage(currentPage + 1);
        }
    };

    const saveAnswers = () => {
        console.log('Answers saved:', answers);
    };

    const submitQuiz = () => {
        handleQuizCompletion();
    };

    const handleQuizCompletion = () => {
        clearInterval(timer);
        saveAnswers();
        let totalScore = 0;
        for (let i = 0; i < questions.length; i++) {
            const question = questions[i];
            switch (question.type) {
                case 'radio':
                case 'dropdown':
                    if (answers[i] === question.correct) {
                        totalScore++;
                    }
                    break;
                case 'checkbox':
                    if (answers[i] && JSON.stringify(answers[i].sort()) === JSON.stringify(question.correct.sort())) {
                        totalScore++;
                    }
                    break;
                case 'text':
                    if (answers[i] && answers[i].trim().toLowerCase() === question.correct.toLowerCase()) {
                        totalScore++;
                    }
                    break;
                default:
                    break;
            }
        }
        setScore(totalScore);
    };

    return (
        <div className="container">
            <h1>Java Developer Quiz</h1>
            {score === null ? (
                <>
                    <div id="quiz-container">
                        {showQuestions()}
                    </div>
                    <div id="navigation">
                        <button id="prev-btn" onClick={prevPage} disabled={currentPage === 0}>Previous</button>
                        <button id="next-btn" onClick={nextPage} disabled={(currentPage + 1) * questionsPerPage >= questions.length}>Next</button>
                    </div>
                    <div id="timer">Time Remaining: <span id="time">{formatTime(timeRemaining)}</span></div>
                    {currentPage === Math.ceil(questions.length / questionsPerPage) - 1 && (
                        <button id="submit-btn" onClick={submitQuiz}>Submit</button>
                    )}
                </>
            ) : (
                <div id="score-container">
                    <h2>Your Score: <span id="score">{score}</span> / {questions.length}</h2>
                </div>
            )}
        </div>
    );
};

export default QuizComponent;
