const questionsPerPage = 5;
let currentPage = 0;
let score = 0;
let timer;
let answers = [];

function startQuiz() {
    const questionElements = document.querySelectorAll('#questions .question');
    questionElements.forEach((q, i) => {
        const correctAnswer = q.getAttribute('data-correct');
        let correct;
        if (q.getAttribute('data-type') === 'checkbox') {
            correct = correctAnswer.split(',').map(x => parseInt(x, 10));
        } else if (q.getAttribute('data-type') === 'radio' || q.getAttribute('data-type') === 'dropdown') {
            correct = parseInt(correctAnswer, 10);
        } else {
            correct = correctAnswer;
        }
        answers.push({ element: q, correct });
    });

    showQuestions();
    startTimer();
}

function showQuestions() {
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = '';
    const start = currentPage * questionsPerPage;
    const end = start + questionsPerPage;
    const currentQuestions = answers.slice(start, end);

    currentQuestions.forEach(({ element }) => {
        quizContainer.appendChild(element);
    });

    document.getElementById('prev-btn').disabled = currentPage === 0;
    document.getElementById('next-btn').disabled = (currentPage + 1) * questionsPerPage >= answers.length;
}

function prevPage() {
    if (currentPage > 0) {
        saveAnswers();
        currentPage--;
        showQuestions();
    }
}

function nextPage() {
    if ((currentPage + 1) * questionsPerPage < answers.length) {
        saveAnswers();
        currentPage++;
        showQuestions();
    }
}

function saveAnswers() {
    const start = currentPage * questionsPerPage;
    const currentQuestions = answers.slice(start, start + questionsPerPage);

    currentQuestions.forEach(({ element, correct }, index) => {
        const questionIndex = start + index;
        const name = `question${questionIndex}`;
        switch (element.getAttribute('data-type')) {
            case 'radio':
                const radioSelected = document.querySelector(`input[name="${name}"]:checked`);
                answers[questionIndex].userAnswer = radioSelected ? parseInt(radioSelected.value, 10) : null;
                break;
            case 'dropdown':
                const dropdownSelected = document.querySelector(`select[name="${name}"]`).value;
                answers[questionIndex].userAnswer = dropdownSelected ? parseInt(dropdownSelected, 10) : null;
                break;
            case 'checkbox':
                const checkboxesSelected = document.querySelectorAll(`input[name="${name}"]:checked`);
                answers[questionIndex].userAnswer = Array.from(checkboxesSelected).map(cb => parseInt(cb.value, 10));
                break;
            case 'text':
                const textSelected = document.querySelector(`input[name="${name}"]`).value;
                answers[questionIndex].userAnswer = textSelected || null;
                break;
        }
    });
}

function submitQuiz() {
    clearInterval(timer);
    saveAnswers();

    answers.forEach(({ userAnswer, correct }) => {
        if (Array.isArray(correct)) {
            if (JSON.stringify(userAnswer.sort()) === JSON.stringify(correct.sort())) {
                score++;
            }
        } else if (typeof correct === 'string') {
            if (userAnswer && userAnswer.trim().toLowerCase() === correct.toLowerCase()) {
                score++;
            }
        } else {
            if (userAnswer === correct) {
                score++;
            }
        }
    });

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
