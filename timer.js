// Initial Settings
let holdDate = new Date();
let restDate = new Date();
let pauseDate = new Date();
holdDate.setMinutes(0);
holdDate.setSeconds(120);
restDate.setMinutes(0);
restDate.setSeconds(0);
let numberPoses = 3;
let secondsHold = 0;
let secondsRest = 0;
let secondsPassed = -1;
poseCount = 1;
let time = 10;

// Audios to plat between minutes
let oneMin = new Audio('gong1.mp3');
let twoMin = new Audio('gong2.mp3');
let threeMin = new Audio('Gong3.mp3');
let fourMin = new Audio('Gong4.mp3');
let fiveMin = new Audio('gong5.mp3');

// Timer variables
let timerAction;
let timerStop;

// Settings buttons
const increasePoses = document.querySelector('#increasePoses')
const decreasePoses = document.querySelector('#decreasePoses')
const increaseHold = document.querySelector('#increaseHold')
const decreaseHold = document.querySelector('#decreaseHold')
const increaseRest = document.querySelector('#increaseRest')
const decreaseRest = document.querySelector('#decreaseRest')

increasePoses.addEventListener('click', () => {
    numberPoses++
    if (numberPoses >= 2) {
        document.querySelector('#decreasePoses').disabled = false;
    }
    document.querySelector('#Poses').innerHTML = numberPoses.toString(10).padStart(2, '0');
});
decreasePoses.addEventListener('click', () => {

    if (numberPoses <= 2) {
        document.querySelector('#decreasePoses').disabled = true;
        numberPoses = 1;
    }
    else {
        numberPoses--;
        document.querySelector('#decreasePoses').disabled = false;
    }
    document.querySelector('#Poses').innerHTML = numberPoses.toString(10).padStart(2, '0');
});
increaseHold.addEventListener('click', () => {
    holdDate.setSeconds(holdDate.getSeconds() + 60)
    if (holdDate.getMinutes() > 1) {
        document.querySelector('#decreaseHold').disabled = false;
    }
    if (holdDate.getMinutes() === 5) {
        document.querySelector('#increaseHold').disabled = true;
        document.querySelector('#Hold').innerHTML = holdDate.getMinutes().toString(10).padStart(2, '0') + ":" + holdDate.getSeconds().toString(10).padStart(2, '0');
    }
    document.querySelector('#Hold').innerHTML = holdDate.getMinutes().toString(10).padStart(2, '0') + ":" + holdDate.getSeconds().toString(10).padStart(2, '0')
});
decreaseHold.addEventListener('click', () => {
    holdDate.setSeconds(holdDate.getSeconds() - 60)
    if (holdDate.getMinutes() <= 1) {
        document.querySelector('#decreaseHold').disabled = true;
    } else if (holdDate.getMinutes() === 5) {
        document.querySelector('#increaseHold').disabled = false;
    }
    else if (holdDate.getMinutes() < 5) {
        document.querySelector('#increaseHold').disabled = false;
    }

    document.querySelector('#Hold').innerHTML = holdDate.getMinutes().toString(10).padStart(2, '0') + ":" + holdDate.getSeconds().toString(10).padStart(2, '0');
});
increaseRest.addEventListener('click', () => {
    restDate.setSeconds(restDate.getSeconds() + 1)
    if (restDate.getSeconds() > 0) {
        document.querySelector('#decreaseRest').disabled = false;
    }
    document.querySelector('#Rest').innerHTML = restDate.getMinutes().toString(10).padStart(2, '0') + ":" + restDate.getSeconds().toString(10).padStart(2, '0');
});
decreaseRest.addEventListener('click', () => {
    restDate.setSeconds(restDate.getSeconds() - 1);

    if (restDate.getMinutes() === 0 && restDate.getSeconds() === 0) {
        document.querySelector('#decreaseRest').disabled = true;
    }

    document.querySelector('#Rest').innerHTML = restDate.getMinutes().toString(10).padStart(2, '0') + ":" + restDate.getSeconds().toString(10).padStart(2, '0');
});

// Playable Buttons
const start = document.querySelector('#start')
const stop = document.querySelector('#stop')
const pause = document.querySelector('#pause')
const resume = document.querySelector('#resume')

// Start Timer
start.addEventListener('click', () => {
    document.querySelector('.final').style.display = "none";
    start.style.display = "none";
    resume.style.display = "flex";
    resume.disabled = true;
    document.querySelector('#poseNumber').style.display = "flex";
    getReady();
})

// Stop Timer
stop.addEventListener('click', () => {
    time = 10
    poseCount = 1;
    clearInterval(timerAction);
    clearTimeout(timerStop);
    getReady();
})

// Preparation time
function getReady() {
    document.querySelector('#poseNumber').innerHTML = "Get Ready";
    document.querySelector('#poseCounter').style.display = "flex";
    stop.disabled = true;
    start.disabled = true;

    let preparation = setInterval(() => {
        document.querySelector('#poseCounter').innerHTML = time;
        --time;
    }, 1000);

    setTimeout(() => {
        clearInterval(preparation);
        provideInfo();
    }, time * 1000);
}

function provideInfo() {
    if (poseCount > numberPoses) {
        document.querySelector('#poseNumber').style.display = "none";
        document.querySelector('#poseCounter').style.display = "none";
        start.style.display = "flex";
        resume.style.display = "none";
        document.querySelector('.final').style.display = "flex";
        clearTimeout();
        poseCount = 1
    }
    else {
        document.querySelector('#poseNumber').innerHTML = `Pose #${poseCount}`;
        let duration = (holdDate.getMinutes() * 60) + holdDate.getSeconds();
        let display = document.querySelector('#poseCounter');
        startTimer(duration, display);
    }
}

function startTimer(duration, display) {
    start.disabled = false;
    stop.disabled = false;
    let timer = duration, minutes, seconds;
    timerAction = setInterval(function () {

        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            timer = duration;
        }

        secondsPassed++;

        if (secondsPassed === 60) {
            oneMin.play();
        } else if (secondsPassed === 120) {
            twoMin.play();
        } else if (secondsPassed === 180) {
            threeMin.play();
        } else if (secondsPassed === 240) {
            fourMin.play();
        } else if (secondsPassed === 300) {
            fiveMin.play();
        }

    }, 1000);

    timerStop = setTimeout(() => {
        clearInterval(timerAction);
        rest();
    }, (duration * 1000) + 1000);


    pause.addEventListener('click', () => {
        resume.disabled = false;
        clearInterval(timerAction);
        clearTimeout(timerStop);
        pauseDate.setMinutes(minutes)
        pauseDate.setSeconds(seconds)
    })
}

resume.addEventListener('click', () => {
    secondsPassed--;
    resume.disabled = true;
    let duration = (pauseDate.getMinutes() * 60) + pauseDate.getSeconds()
    let display = document.querySelector('#poseCounter');
    startTimer(duration, display);
})

function rest() {
    if (restDate.getSeconds() > 0 || restDate.getMinutes() > 0) {
        document.querySelector('#poseNumber').innerHTML = "Rest";
    }
    restInfo();
}

function restInfo() {
    let duration = (restDate.getMinutes() * 60) + restDate.getSeconds();
    display = document.querySelector('#poseCounter');
    restTimer(duration, display);
}

function restTimer(duration, display) {
    secondsPassed = 0
    let timer = duration, minutes, seconds;
    let timerAction = setInterval(function () {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            timer = duration;
        }

    }, 1000);

    setTimeout(() => {
        clearInterval(timerAction);
        ++poseCount;
        secondsPassed = -1;
        provideInfo();
    }, duration * 1000);
}