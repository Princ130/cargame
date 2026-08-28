/*
    TYPE RACE
    SOLO PRACTICE ARENA

    No server.
    No libraries.
*/


// =====================================================
// GAME MODES
// =====================================================

const MODES = {

    practice: {

        idleGrace: 1200,
        heavyIdle: 2500,

        activeDecay: 0.01,
        idleDecay: 0.10,
        heavyDecay: 0.20,
        extremeDecay: 0.35,

        recovery: 2,

        mistakeStability: 8,
        mistakeDamage: 1,

        criticalStability: 15,
        criticalDamage: 0.04
    },


    race: {

        idleGrace: 700,
        heavyIdle: 2000,

        activeDecay: 0.01,
        idleDecay: 0.18,
        heavyDecay: 0.38,
        extremeDecay: 0.65,

        recovery: 2,

        mistakeStability: 8,
        mistakeDamage: 2,

        criticalStability: 15,
        criticalDamage: 0.8
    },


    survival: {

        idleGrace: 350,
        heavyIdle: 1500,

        activeDecay: 0.02,
        idleDecay: 0.30,
        heavyDecay: 0.60,
        extremeDecay: 0.90,

        recovery: 1.5,

        mistakeStability: 10,
        mistakeDamage: 3,

        criticalStability: 20,
        criticalDamage: 0.16
    }

};


// =====================================================
// STATE
// =====================================================

const state = {

    text:
        "The quick brown fox jumps over the lazy dog while the road disappears into the endless horizon.",

    position: 0,

    hp: 100,

    stability: 100,

    combo: 0,

    maxCombo: 0,

    mistakes: 0,

    correct: 0,

    totalTyped: 0,

    distance: 0,

    startTime: null,

    lastTypedTime: null,

    running: false,

    gameOver: false,

    countdownRunning: false

};


// =====================================================
// SELECTED MODE
// =====================================================

let selectedMode = "practice";

let currentMode = MODES.practice;


// =====================================================
// ELEMENTS
// =====================================================

const modeScreen =
    document.getElementById("modeSelect");

const modeButtons =
    document.querySelectorAll(".mode-option");

const startGameButton =
    document.getElementById("startGameButton");

const modeTitle =
    document.getElementById("modeTitle");

const input =
    document.getElementById("typingInput");

const textDisplay =
    document.getElementById("textDisplay");

const hpBar =
    document.getElementById("hpBar");

const hpText =
    document.getElementById("hpText");

const stabilityBar =
    document.getElementById("stabilityBar");

const stabilityText =
    document.getElementById("stabilityText");

const comboText =
    document.getElementById("combo");

const wpmText =
    document.getElementById("wpm");

const accuracyText =
    document.getElementById("accuracy");

const distanceText =
    document.getElementById("distance");

const car =
    document.getElementById("car");

const hazards =
    document.getElementById("hazards");

const countdown =
    document.getElementById("countdown");

const gameOver =
    document.getElementById("gameOver");

const resultIcon =
    document.getElementById("resultIcon");

const resultTitle =
    document.getElementById("resultTitle");

const resultMessage =
    document.getElementById("resultMessage");

const finalWpm =
    document.getElementById("finalWpm");

const finalAccuracy =
    document.getElementById("finalAccuracy");

const finalDistance =
    document.getElementById("finalDistance");

const restart =
    document.getElementById("restart");


// =====================================================
// SAFETY CHECK
// =====================================================

console.log("TYPE RACE loaded");


// =====================================================
// MODE SELECTION
// =====================================================

modeButtons.forEach(button => {

    button.addEventListener("click", () => {

        selectedMode =
            button.dataset.mode;

        modeButtons.forEach(btn => {

            btn.classList.remove("selected");

        });

        button.classList.add("selected");

        console.log(
            "Selected mode:",
            selectedMode
        );

    });

});


// =====================================================
// START BUTTON
// =====================================================

startGameButton.addEventListener("click", () => {

    console.log(
        "START RACE clicked"
    );

    currentMode =
        MODES[selectedMode];

    modeTitle.textContent =
        selectedMode.toUpperCase();

    modeScreen.classList.add("hidden");

    startGameButton.disabled = true;

    startCountdown();

});


// =====================================================
// TEXT RENDER
// =====================================================

function renderText() {

    textDisplay.innerHTML = "";

    for (
        let i = 0;
        i < state.text.length;
        i++
    ) {

        const span =
            document.createElement("span");

        span.textContent =
            state.text[i];

        if (
            i < state.position
        ) {

            span.classList.add("correct");

        }

        if (
            i === state.position
        ) {

            span.classList.add("current");

        }

        textDisplay.appendChild(span);

    }

}


// =====================================================
// COUNTDOWN
// =====================================================

function startCountdown() {

    if (state.countdownRunning)
        return;

    state.countdownRunning = true;

    let count = 3;

    countdown.classList.remove("hidden");

    countdown.textContent = count;

    console.log("COUNTDOWN STARTED");

    const timer =
        setInterval(() => {

            count--;

            if (count > 0) {

                countdown.textContent =
                    count;

            } else {

                clearInterval(timer);

                countdown.textContent =
                    "GO!";

                setTimeout(() => {

                    countdown.classList.add(
                        "hidden"
                    );

                    state.countdownRunning =
                        false;

                    startGame();

                }, 500);

            }

        }, 1000);

}


// =====================================================
// START GAME
// =====================================================

function startGame() {

    console.log("GAME STARTED");

    state.running = true;

    state.gameOver = false;

    state.startTime =
        Date.now();

    state.lastTypedTime =
        Date.now();

    input.disabled = false;

    input.value = "";

    input.focus();

    renderText();

    updateUI();

    requestAnimationFrame(
        gameLoop
    );

}


// =====================================================
// TYPING
// =====================================================

input.addEventListener(
    "input",
    () => {

        if (
            !state.running ||
            state.gameOver
        ) {

            return;

        }

        state.lastTypedTime =
            Date.now();

        const value =
            input.value;

        if (!value.length)
            return;

        const typedCharacter =
            value[value.length - 1];

        const expectedCharacter =
            state.text[state.position];


        // =================================================
        // CORRECT
        // =================================================

        if (
            typedCharacter ===
            expectedCharacter
        ) {

            state.position++;

            state.correct++;

            state.totalTyped++;

            state.combo++;

            state.maxCombo =
                Math.max(
                    state.maxCombo,
                    state.combo
                );


            // Stability recovery

            state.stability =
                Math.min(
                    100,
                    state.stability +
                    currentMode.recovery
                );


            // Distance

            state.distance += 1.2;


            // Win

            if (
                state.position >=
                state.text.length
            ) {

                input.value = "";

                renderText();

                updateUI();

                winGame();

                return;

            }

        }


        // =================================================
        // WRONG
        // =================================================

        else {

            state.mistakes++;

            state.totalTyped++;

            state.combo = 0;


            // Stability

            state.stability -=
                currentMode.mistakeStability;


            // HP

            state.hp -=
                currentMode.mistakeDamage;


            // Effects

            spawnHazard();

            shakeCar();


            // Clamp

            state.stability =
                Math.max(
                    0,
                    state.stability
                );

            state.hp =
                Math.max(
                    0,
                    state.hp
                );


            // Crash

            if (
                state.hp <= 0
            ) {

                input.value = "";

                updateUI();

                crash();

                return;

            }

        }


        // Clear input

        input.value = "";

        renderText();

        updateUI();

    }
);


// =====================================================
// HAZARD
// =====================================================

function spawnHazard() {

    const hazard =
        document.createElement("div");

    hazard.className =
        "hazard";

    hazard.textContent =
        Math.random() > .75
            ? "🪨"
            : "•";

    hazard.style.left =
        (
            15 +
            Math.random() * 70
        ) + "%";

    const duration =
        1.5 +
        Math.random() * 1.5;

    hazard.style.animationDuration =
        duration + "s";

    hazards.appendChild(hazard);

    setTimeout(() => {

        hazard.remove();

    }, duration * 1000 + 200);

}


// =====================================================
// CAR SHAKE
// =====================================================

function shakeCar() {

    car.classList.remove("shake");

    void car.offsetWidth;

    car.classList.add("shake");

    setTimeout(() => {

        if (
            state.stability >= 70
        ) {

            car.classList.remove(
                "shake"
            );

        }

    }, 400);

}


// =====================================================
// GAME LOOP
// =====================================================

function gameLoop() {

    if (
        !state.running ||
        state.gameOver
    ) {

        return;

    }

    const now =
        Date.now();

    const idleTime =
        now -
        state.lastTypedTime;


    // =================================================
    // STABILITY DECAY
    // =================================================

    if (
        idleTime <
        currentMode.idleGrace
    ) {

        state.stability -=
            currentMode.activeDecay;

    }

    else if (
        idleTime <
        currentMode.heavyIdle
    ) {

        state.stability -=
            currentMode.idleDecay;

    }

    else if (
        idleTime <
        currentMode.heavyIdle + 1500
    ) {

        state.stability -=
            currentMode.heavyDecay;

    }

    else {

        state.stability -=
            currentMode.extremeDecay;

    }


    // Clamp stability

    state.stability =
        Math.max(
            0,
            state.stability
        );


    // =================================================
    // DISTANCE
    // =================================================

    if (
        state.stability > 20
    ) {

        state.distance +=
            state.stability / 500;

    }


    // =================================================
    // CRITICAL DAMAGE
    // =================================================

    if (
        state.stability <=
        currentMode.criticalStability
    ) {

        state.hp -=
            currentMode.criticalDamage;

    }


    // Clamp HP

    state.hp =
        Math.max(
            0,
            state.hp
        );


    // Crash

    if (
        state.hp <= 0
    ) {

        crash();

        return;

    }


    // Update

    updateUI();


    // Continue

    requestAnimationFrame(
        gameLoop
    );

}


// =====================================================
// UI
// =====================================================

function updateUI() {

    // HP

    hpBar.style.width =
        Math.max(
            0,
            Math.min(
                100,
                state.hp
            )
        ) + "%";

    hpText.textContent =
        Math.round(
            state.hp
        );


    // Stability

    stabilityBar.style.width =
        state.stability + "%";

    stabilityText.textContent =
        Math.round(
            state.stability
        ) + "%";


    // Combo

    comboText.textContent =
        state.combo;


    // Distance

    distanceText.textContent =
        Math.floor(
            state.distance
        );


    // =================================================
    // ACCURACY
    // =================================================

    const accuracy =
        state.totalTyped === 0
            ? 100
            :
            (
                state.correct /
                state.totalTyped
            ) * 100;

    accuracyText.textContent =
        Math.round(
            accuracy
        ) + "%";


    // =================================================
    // WPM
    // =================================================

    if (
        state.startTime
    ) {

        const minutes =
            (
                Date.now() -
                state.startTime
            ) / 60000;

        const words =
            state.correct / 5;

        const wpm =
            minutes > 0
                ? words / minutes
                : 0;

        wpmText.textContent =
            Math.round(
                wpm
            );

    }


    // =================================================
    // CAR EFFECT
    // =================================================

    if (
        state.stability < 70
    ) {

        car.classList.add(
            "shake"
        );

    }

    else {

        car.classList.remove(
            "shake"
        );

    }


    // Critical effect

    if (
        state.stability < 30
    ) {

        car.style.filter =
            "drop-shadow(0 10px 6px rgba(0,0,0,.55)) brightness(1.15)";

    }

    else {

        car.style.filter =
            "drop-shadow(0 10px 6px rgba(0,0,0,.55))";

    }

}


// =====================================================
// CRASH
// =====================================================

function crash() {

    if (
        state.gameOver
    )
        return;

    state.gameOver = true;

    state.running = false;

    input.disabled = true;

    car.classList.add(
        "crashed"
    );

    resultIcon.textContent =
        "💥";

    resultTitle.textContent =
        "CRASH!";

    resultTitle.style.color =
        "#ff4058";

    resultMessage.textContent =
        "Your car couldn't stay stable.";

    showResults();

}


// =====================================================
// WIN
// =====================================================

function winGame() {

    if (
        state.gameOver
    )
        return;

    state.gameOver = true;

    state.running = false;

    input.disabled = true;

    resultIcon.textContent =
        "🏆";

    resultTitle.textContent =
        "YOU WIN!";

    resultTitle.style.color =
        "#39e58c";

    resultMessage.textContent =
        "You completed the route!";

    showResults();

}


// =====================================================
// RESULTS
// =====================================================

function showResults() {

    finalWpm.textContent =
        wpmText.textContent;

    finalAccuracy.textContent =
        accuracyText.textContent;

    finalDistance.textContent =
        Math.floor(
            state.distance
        ) + "m";

    gameOver.classList.remove(
        "hidden"
    );

}


// =====================================================
// RESTART
// =====================================================

restart.addEventListener(
    "click",
    () => {

        location.reload();

    }
);


// =====================================================
// INITIALIZE
// =====================================================

renderText();

updateUI();

input.disabled = true;

console.log(
    "Game ready. Choose a mode."
);
