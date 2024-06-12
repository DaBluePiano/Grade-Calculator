let examCounter = 1;

function addExamSlot() {
    examCounter++;
    const examSlots = document.getElementById('examSlots');
    const newSlot = document.createElement('div');
    newSlot.classList.add('examSlot');
    newSlot.innerHTML = `
        <label for="exam${examCounter}Score">Exam ${examCounter} Score:</label>
        <input type="text" id="exam${examCounter}Score" class="score" placeholder="e.g. 45/50 or 90%" required>
        <label for="weight${examCounter}">Weight (%):</label>
        <input type="number" id="weight${examCounter}" class="weight" min="0" max="100" required>
        <input type="range" id="weight${examCounter}Slider" class="weightSlider" min="0" max="100" oninput="syncWeightSlider(${examCounter})" onchange="syncWeightSlider(${examCounter})">
    `;
    examSlots.appendChild(newSlot);
}

function syncWeightSlider(examIndex) {
    const weightInput = document.getElementById(`weight${examIndex}`);
    const weightSlider = document.getElementById(`weight${examIndex}Slider`);
    weightInput.value = weightSlider.value;
}

function parseScore(score) {
    if (score.includes('/')) {
        const [obtained, total] = score.split('/').map(Number);
        return (obtained / total) * 100;
    } else if (score.includes('%')) {
        return parseFloat(score);
    } else {
        return parseFloat(score);
    }
}

function calculateGrade() {
    const scores = document.querySelectorAll('.score');
    const weights = document.querySelectorAll('.weight');
    let totalScore = 0;
    let totalWeight = 0;

    scores.forEach((score, index) => {
        const weight = parseFloat(weights[index].value);
        const parsedScore = parseScore(score.value);
        totalScore += parsedScore * (weight / 100);
        totalWeight += weight;
    });

    const finalGrade = totalScore / (totalWeight / 100);
    const resultText = totalWeight === 100 ? `Final Grade: ${finalGrade.toFixed(2)}` : `Current Grade: ${finalGrade.toFixed(2)}`;
    document.getElementById('result').innerText = resultText;
}

function calculateNeededGrade() {
    const scores = document.querySelectorAll('.score');
    const weights = document.querySelectorAll('.weight');
    const desiredGrade = parseFloat(document.getElementById('desiredGrade').value);
    let totalScore = 0;
    let totalWeight = 0;

    scores.forEach((score, index) => {
        const weight = parseFloat(weights[index].value);
        const parsedScore = parseScore(score.value);
        totalScore += parsedScore * (weight / 100);
        totalWeight += weight;
    });

    const remainingWeight = 100 - totalWeight;
    if (remainingWeight <= 0) {
        document.getElementById('neededGradeResult').innerText = 'No weight left for another exam.';
        return;
    }

    const neededScore = ((desiredGrade * (totalWeight + remainingWeight)) - totalScore) / remainingWeight;
    const resultText = neededScore > 100 
        ? "It's not possible unless you're Timmy."
        : `You need to score ${neededScore.toFixed(2)}% on the remaining exam.`;
    
    document.getElementById('neededGradeResult').innerText = resultText;
}
