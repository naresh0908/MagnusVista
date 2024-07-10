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
let currentPage = 0;
let score = 0;
let timer;
let answers = new Array(questions.length).fill(null);

function startQuiz() {
    showQuestions();
    startTimer();
}

function showQuestions() {
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = '';
    const start = currentPage * questionsPerPage;
    const end = start + questionsPerPage;
    const currentQuestions = questions.slice(start, end);

    currentQuestions.forEach((q, index) => {
        const questionElement = document.createElement('div');
        questionElement.classList.add('question');
        questionElement.innerHTML = `<h3>${q.question}</h3>`;

        switch (q.type) {
            case 'radio':
                q.choices.forEach((choice, i) => {
                    questionElement.innerHTML += `
                        <label>
                            <input type="radio" name="question${start + index}" value="${i}" ${answers[start + index] === i ? 'checked' : ''}> ${choice}
                        </label><br>`;
                });
                break;
            case 'dropdown':
                let dropdown = `<select name="question${start + index}">`;
                q.choices.forEach((choice, i) => {
                    dropdown += `<option value="${i}" ${answers[start + index] === i ? 'selected' : ''}>${choice}</option>`;
                });
                dropdown += `</select>`;
                questionElement.innerHTML += dropdown;
                break;
            case 'checkbox':
                q.choices.forEach((choice, i) => {
                    questionElement.innerHTML += `
                        <label>
                            <input type="checkbox" name="question${start + index}" value="${i}" ${answers[start + index] && answers[start + index].includes(i) ? 'checked' : ''}> ${choice}
                        </label><br>`;
                });
                break;
            case 'text':
                questionElement.innerHTML += `
                    <label>
                        <input type="text" name="question${start + index}" value="${answers[start + index] || ''}">
                    </label><br>`;
                break;
        }
        quizContainer.appendChild(questionElement);
    });

    document.getElementById('prev-btn').disabled = currentPage === 0;
    document.getElementById('next-btn').disabled = (currentPage + 1) * questionsPerPage >= questions.length;
}

function prevPage() {
    if (currentPage > 0) {
        saveAnswers();
        currentPage--;
        showQuestions();
    }
}

function nextPage() {
    if ((currentPage + 1) * questionsPerPage < questions.length) {
        saveAnswers();
        currentPage++;
        showQuestions();
    }
}

function saveAnswers() {
    const start = currentPage * questionsPerPage;
    for (let i = 0; i < questionsPerPage; i++) {
        const questionIndex = start + i;
        const question = questions[questionIndex];
        const name = `question${questionIndex}`;
        switch (question.type) {
            case 'radio':
                const radioSelected = document.querySelector(`input[name="${name}"]:checked`);
                answers[questionIndex] = radioSelected ? parseInt(radioSelected.value, 10) : null;
                break;
            case 'dropdown':
                const dropdownSelected = document.querySelector(`select[name="${name}"]`).value;
                answers[questionIndex] = dropdownSelected ? parseInt(dropdownSelected, 10) : null;
                break;
            case 'checkbox':
                const checkboxesSelected = document.querySelectorAll(`input[name="${name}"]:checked`);
                answers[questionIndex] = Array.from(checkboxesSelected).map(cb => parseInt(cb.value, 10));
                break;
            case 'text':
                const textSelected = document.querySelector(`input[name="${name}"]`).value;
                answers[questionIndex] = textSelected || null;
                break;
        }
    }
}

function submitQuiz() {
    clearInterval(timer);
    saveAnswers();

    for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        switch (question.type) {
            case 'radio':
            case 'dropdown':
                if (answers[i] === question.correct) {
                    score++;
                }
                break;
            case 'checkbox':
                if (JSON.stringify(answers[i].sort()) === JSON.stringify(question.correct.sort())) {
                    score++;
                }
                break;
            case 'text':
                if (answers[i] && answers[i].trim().toLowerCase() === question.correct.toLowerCase()) {
                    score++;
                }
                break;
        }
    }

    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('navigation').style.display = 'none';
    document.getElementById('submit-btn').style.display = 'none';
    document.getElementById('score').innerText = score;
    document.getElementById('score-container').style.display = 'block';
}

function startTimer() {
    let timeRemaining = 300; 
    timer = setInterval(() => {
        if (timeRemaining <= 0) {
            clearInterval(timer);
            submitQuiz();
        } else {
            timeRemaining--;
            const minutes = Math.floor(timeRemaining / 60);
            const seconds = timeRemaining % 60;
            document.getElementById('time').innerText = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        }
    }, 1000);
}

document.addEventListener('DOMContentLoaded', startQuiz);
