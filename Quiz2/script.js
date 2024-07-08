let questions = [];
const questionsPerPage = 5;
let currentPage = 0;
let score = 0;
let timer;
let answers = [];

async function fetchQuestions() {
    try {
        const response = await fetch('questions.json');
        questions = await response.json();
        answers = new Array(questions.length).fill(null);
        startQuiz();
    } catch (error) {
        console.error('Failed to fetch questions:', error);
    }
}

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
                        <label class="radio-container">
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
                        <label class="checkbox-container">
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

document.addEventListener('DOMContentLoaded', fetchQuestions);
