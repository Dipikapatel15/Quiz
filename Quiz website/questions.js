const questionNumber = document.querySelector(".question-number");
const questionText = document.querySelector(".question-text");
const optionContainer = document.querySelector(".option-container");
const answersIndicatorContainer = document.querySelector(".answers-indicator");
const homeBox = document.querySelector(".home-box");
const quizBox = document.querySelector(".quiz-box");
const resultBox = document.querySelector(".result-box");

let questionCounter = 0;
let currentQuestion;
let availableQuestions = [];
let availableOptions = [];
let questionHistory = [];
let correctAnswers = 0;
let attempt = 0;

function setAvailableQuestions() {
    const totalQuestion = quiz.length;
    for (let i = 0; i < totalQuestion; i++) {
        availableQuestions.push(quiz[i]);
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    const backButton = document.getElementById('backButton');
    if (backButton) {
        backButton.addEventListener('click', back);
    } else {
        console.error('Back button not found');
    }

    const nextButton = document.getElementById('nextButton');
    if (nextButton) {
        nextButton.addEventListener('click', next);
    } else {
        console.error('Next button not found');
    }
});

function getNewQuestion() {
    optionContainer.innerHTML = '';

    questionNumber.innerHTML = "Question " + (questionCounter + 1) + " of " + quiz.length;

    const questionIndex = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    currentQuestion = questionIndex;
    questionText.innerHTML = currentQuestion.q;

    const index1 = availableQuestions.indexOf(questionIndex);
    availableQuestions.splice(index1, 1);

    const optionLen = currentQuestion.options.length;
    availableOptions = [];
    for (let i = 0; i < optionLen; i++) {
        availableOptions.push(i);
    }

    questionHistory.push({
        question: currentQuestion,
        options: [...availableOptions]
    });

    let animationDelay = 0.15;
    for (let i = 0; i < optionLen; i++) {
        const optionIndex = availableOptions[Math.floor(Math.random() * availableOptions.length)];
        const index2 = availableOptions.indexOf(optionIndex);
        availableOptions.splice(index2, 1);

        const option = document.createElement("div");
        option.innerHTML = currentQuestion.options[optionIndex];
        option.id = optionIndex;
        option.style.animationDelay = animationDelay + "s";
        animationDelay += 0.15;
        option.className = "option";
        optionContainer.appendChild(option);
        option.setAttribute("onclick", "getResult(this)");
    }

    questionCounter++;
}

function getResult(element) {
    const id = parseInt(element.id);
    let isCorrect = false;
    if (id === currentQuestion.answer) {
        element.classList.add("correct");
        updateAnswerIndicator("correct");
        correctAnswers++;
        isCorrect = true;
    } else {
        element.classList.add("wrong");
        updateAnswerIndicator("wrong");
        const optionLen = optionContainer.children.length;
        for (let i = 0; i < optionLen; i++) {
            if (parseInt(optionContainer.children[i].id) === currentQuestion.answer) {
                optionContainer.children[i].classList.add("correct");
            }
        }
    }
    attempt++;
    unclickableOptions();
    // Log the question, selected answer, and whether it was correct
    console.log("Question:", currentQuestion.q);
    console.log("Selected Answer:", currentQuestion.options[id]);
    console.log("Correct Answer:", currentQuestion.options[currentQuestion.answer]);
    console.log("Correct:", isCorrect);
}

function unclickableOptions() {
    const optionLen = optionContainer.children.length;
    for (let i = 0; i < optionLen; i++) {
        optionContainer.children[i].classList.add("already-answered");
    }
}

function answersIndicator() {
    answersIndicatorContainer.innerHTML = '';
    const totalQuestion = quiz.length;
    for (let i = 0; i < totalQuestion; i++) {
        const indicator = document.createElement("div");
        answersIndicatorContainer.appendChild(indicator);
    }
}

function updateAnswerIndicator(markType) {
    answersIndicatorContainer.children[questionCounter - 1].classList.add(markType);
}

function next() {
    if (questionCounter === quiz.length) {
        quizOver();
    } else {
        getNewQuestion();
    }
}

function quizOver() {
    quizBox.classList.add("hide");
    resultBox.classList.remove("hide");
    quizResult();
}

function quizResult() {
    const totalQuestions = quiz.length;
    const wrongAnswers = attempt - correctAnswers;
    const percentage = (correctAnswers / totalQuestions) * 100;

    document.getElementById('total-questions').textContent = totalQuestions;
    document.getElementById('attempt').textContent = attempt;
    document.getElementById('correct').textContent = correctAnswers;
    document.getElementById('wrong').textContent = wrongAnswers;
    document.getElementById('percentage').textContent = percentage.toFixed(2) + '%';
    document.getElementById('total-score').textContent = correctAnswers + '/' + totalQuestions;
}

function back() {
    if (questionCounter > 1) {
        questionCounter--;
        const previousQuestion = questionHistory.pop();
        currentQuestion = previousQuestion.question;
        availableOptions = previousQuestion.options;

        optionContainer.innerHTML = '';

        questionNumber.innerHTML = "Question " + questionCounter + " of " + quiz.length;
        questionText.innerHTML = currentQuestion.q;

        let animationDelay = 0.15;
        for (let i = 0; i < availableOptions.length; i++) {
            const option = document.createElement("div");
            option.innerHTML = currentQuestion.options[availableOptions[i]];
            option.id = availableOptions[i];
            option.style.animationDelay = animationDelay + "s";
            animationDelay += 0.15;
            option.className = "option";
            optionContainer.appendChild(option);
            option.setAttribute("onclick", "getResult(this)");
        }
    }
}

function tryAgainQuiz() {
    resultBox.classList.add("hide");
    quizBox.classList.remove("hide");
    resetQuiz();
    startQuiz();
}

function goToHome() {
    resultBox.classList.add("hide");
    homeBox.classList.remove("hide");
    resetQuiz();
}

function resetQuiz() {
    questionCounter = 0;
    correctAnswers = 0;
    attempt = 0;
    availableQuestions = [];
    questionHistory = [];
}

function startQuiz() {
    homeBox.classList.add("hide");
    quizBox.classList.remove("hide");
    setAvailableQuestions();
    getNewQuestion();
    answersIndicator();
}

window.onload = function () {
    homeBox.querySelector(".total-question").innerHTML = quiz.length;
};
