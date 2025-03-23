const chordData = {
    major: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
    minor: ['Cm', 'Dm', 'Em', 'Fm', 'Gm', 'Am', 'Bm'],
    seventh: ['C7', 'D7', 'E7', 'F7', 'G7', 'A7', 'B7']
};

let isRunning = false;
let currentTimeout = null;
let countdownTimer = null;

function createChordCheckboxes() {
    for (const group in chordData) {
        const container = document.getElementById(`${group}Chords`);
        chordData[group].forEach(chord => {
            const label = document.createElement('label');
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.value = chord;
            input.classList.add(`${group}-chord`);
            input.checked = group !== 'minor'; // 마이너는 기본 해제
            label.appendChild(input);
            label.appendChild(document.createTextNode(chord));
            container.appendChild(label);
        });
    }
}

function toggleGroup(group, isChecked) {
    const checkboxes = document.querySelectorAll(`.${group}-chord`);
    checkboxes.forEach(chk => chk.checked = isChecked);
}

function getSelectedChords() {
    const all = document.querySelectorAll('input[type="checkbox"]:not([id^="selectAll"])');
    return Array.from(all)
        .filter(chk => chk.checked)
        .map(chk => chk.value);
}

function showChordOnly(chord) {
    document.getElementById('code-display').textContent = `🎵 연습할 코드: ${chord}`;
    document.getElementById('image-display').innerHTML = '';
}

function showAnswerImage(chord) {
    const img = document.createElement('img');
    img.src = `img/${chord}.jpg`;
    img.alt = `${chord} 코드 이미지`;
    img.onerror = () => {
        document.getElementById("image-display").textContent = `⚠️ ${chord} 코드 이미지가 없습니다.`;
    };
    const imageDisplay = document.getElementById("image-display");
    imageDisplay.innerHTML = '';
    imageDisplay.appendChild(img);
}

function updateCountdown(seconds) {
    const countdown = document.getElementById('countdown');
    countdown.textContent = `⏳ ${seconds}초 남음`;
}

function runRound(qTime, aTime) {
    if (!isRunning) return;

    const chords = getSelectedChords();
    if (chords.length === 0) {
        alert("최소 하나 이상의 코드를 선택해주세요.");
        stopQuiz();
        return;
    }

    const randomChord = chords[Math.floor(Math.random() * chords.length)];
    showChordOnly(randomChord);

    let timeLeft = qTime / 1000;
    updateCountdown(timeLeft);

    clearInterval(countdownTimer);
    countdownTimer = setInterval(() => {
        timeLeft--;
        updateCountdown(timeLeft);
        if (timeLeft <= 0) clearInterval(countdownTimer);
    }, 1000);

    currentTimeout = setTimeout(() => {
        document.getElementById('countdown').textContent = '';
        showAnswerImage(randomChord);

        currentTimeout = setTimeout(() => {
            runRound(qTime, aTime);
        }, aTime);
    }, qTime);
}

function startQuiz() {
    isRunning = true;
    document.getElementById('startStopButton').textContent = '정지';
    const qTime = parseInt(document.getElementById('questionTime').value) * 1000;
    const aTime = parseInt(document.getElementById('answerTime').value) * 1000;
    runRound(qTime, aTime);
}

function stopQuiz() {
    isRunning = false;
    document.getElementById('startStopButton').textContent = '시작';
    clearTimeout(currentTimeout);
    clearInterval(countdownTimer);
    document.getElementById('countdown').textContent = '';
}

function toggleQuiz() {
    if (isRunning) {
        stopQuiz();
    } else {
        startQuiz();
    }
}

// 초기 체크박스 렌더링
createChordCheckboxes();
