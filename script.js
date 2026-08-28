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

    // ---------------------------------------------
    // PRACTICE
    // Relaxed typing / learning
    // ---------------------------------------------
    practice: {

        idleGrace: 1200,
        heavyIdle: 2500,

        activeDecay: 0.01,
        idleDecay: 0.10,
        heavyDecay: 0.20,
        extremeDecay: 0.35,

        recovery: 2,

        mistakeStability: 8,
        mistakeDamage: 3,

        criticalStability: 15,
        criticalDamage: 0.03
    },


    // ---------------------------------------------
    // RACE
    // Competitive mode
    // ---------------------------------------------
    race: {

        idleGrace: 700,
        heavyIdle: 2000,

        activeDecay: 0.01,
        idleDecay: 0.18,
        heavyDecay: 0.38,
        extremeDecay: 0.65,

        recovery: 2,

        mistakeStability: 8,
        mistakeDamage: 3,

        criticalStability: 15,
        criticalDamage: 0.04
    },


    // ---------------------------------------------
    // SURVIVAL
    // Extremely difficult
    // ---------------------------------------------
    survival: {

        idleGrace: 350,
        heavyIdle: 1500,

        activeDecay: 0.02,
        idleDecay: 0.30,
        heavyDecay: 0.60,
        extremeDecay: 0.90,

        recovery: 1.5,

        mistakeStability: 10,
        mistakeDamage: 5,

        criticalStability: 20,
        criticalDamage: 0.07
    }

};


// =====================================================
// SELECT GAME MODE
// =====================================================

// Change this to:
// "practice"
// "race"
// "survival"

const currentMode = MODES.practice;


// =====================================================
// GAME STATE
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

    lastTypedTime: Date.now(),

    running: false,

    gameOver: false

};


// =====================================================
// ELEMENTS
// =====================================================

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

const finalWpm =
    document.getElementById("finalWpm");

const finalAccuracy =
    document.getElementById("finalAccuracy");

const finalDistance =
    document.getElementById("finalDistance");

const restart =
    document.getElementById("restart");


// =====================================================
// TEXT DISPLAY
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


        // Already typed correctly

        if (i < state.position) {

            span.classList.add("correct");

        }


        // Current character

        if (i === state.position) {

            span.classList.add("current");

        }


        textDisplay.appendChild(span);

    }

}


// =====================================================
// COUNTDOWN
// =====================================================

function startCountdown() {

    let count = 3;

    countdown.classList.remove("hidden");

    countdown.textContent = count;


    const timer =
        setInterval(() => {

            count--;


            if (count > 0) {

                countdown.textContent =
                    count;

            }


            else {

                clearInterval(timer);

                countdown.textContent =
                    "GO!";


                setTimeout(() => {

                    countdown.classList.add("hidden");

                    startGame();

                }, 500);

            }

        }, 1000);

}


// =====================================================
// START GAME
// =====================================================

function startGame() {

    state.running = true;

    state.gameOver = false;

    state.startTime = Date.now();

    state.lastTypedTime = Date.now();


    input.disabled = false;

    input.focus();


    requestAnimationFrame(gameLoop);

}


// =====================================================
// TYPING
// =====================================================

input.addEventListener("input", () => {

    if (
        !state.running ||
        state.gameOver
    ) {

        return;

    }


    // -------------------------------------------------
    // IMPORTANT:
    // Any keyboard activity resets the idle timer.
    // -------------------------------------------------

    state.lastTypedTime = Date.now();


    const value =
        input.value;


    const lastCharacter =
        value[value.length - 1];


    const expected =
        state.text[state.position];


    // =================================================
    // CORRECT CHARACTER
    // =================================================

    if (
        lastCharacter ===
        expected
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


        // ---------------------------------------------
        // Stability recovery
        // ---------------------------------------------

        state.stability =
            Math.min(
                100,
                state.stability +
                currentMode.recovery
            );


        // ---------------------------------------------
        // Small forward movement
        // ---------------------------------------------

        state.distance += 1.2;


        // ---------------------------------------------
        // Paragraph completed
        // ---------------------------------------------

        if (
            state.position >=
            state.text.length
        ) {

            winGame();

        }

    }


    // =================================================
    // WRONG CHARACTER
    // =================================================

    else {

        state.mistakes++;

        state.totalTyped++;

        state.combo = 0;


        // ---------------------------------------------
        // Stability damage
        // ---------------------------------------------

        state.stability -=
            currentMode.mistakeStability;


        // ---------------------------------------------
        // HP damage
        // ---------------------------------------------

        state.hp -=
            currentMode.mistakeDamage;


        // ---------------------------------------------
        // Spawn obstacle
        // ---------------------------------------------

        spawnHazard();


        // ---------------------------------------------
        // Shake car
        // ---------------------------------------------

        shakeCar();


        // ---------------------------------------------
        // Clamp values
        // ---------------------------------------------

        if (state.stability < 0) {

            state.stability = 0;

        }


        if (state.hp < 0) {

            state.hp = 0;

        }


        // ---------------------------------------------
        // Crash
        // ---------------------------------------------

        if (state.hp <= 0) {

            crash();

        }

    }


    // Clear input after every character

    input.value = "";


    renderText();

    updateUI();

});


// =====================================================
// HAZARDS
// =====================================================

function spawnHazard() {

    const hazard =
        document.createElement("div");


    hazard.className =
        "hazard";


    // Mostly pebbles,
    // occasionally a large rock.

    hazard.textContent =
        Math.random() > 0.75
            ? "🪨"
            : "•";


    // Keep hazards inside road

    const roadWidth =
        15 +
        Math.random() * 70;


    hazard.style.left =
        roadWidth + "%";


    // Random speed

    const duration =
        1.5 +
        Math.random() * 1.5;


    hazard.style.animationDuration =
        duration + "s";


    hazards.appendChild(hazard);


    setTimeout(() => {

        hazard.remove();

    }, duration * 1000 + 100);

}


// =====================================================
// CAR SHAKE
// =====================================================

function shakeCar() {

    car.classList.add("shake");


    setTimeout(() => {

        car.classList.remove("shake");

    }, 500);

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


    // =================================================
    // IDLE TIME
    // =================================================

    const idleTime =
        Date.now() -
        state.lastTypedTime;


    // =================================================
    // STABILITY DECAY
    // =================================================

    if (
        idleTime <
        currentMode.idleGrace
    ) {

        // ---------------------------------------------
        // Player is actively typing
        // ---------------------------------------------

        state.stability -=
            currentMode.activeDecay;

    }


    else if (
        idleTime <
        currentMode.heavyIdle
    ) {

        // ---------------------------------------------
        // Player has briefly stopped
        // ---------------------------------------------

        state.stability -=
            currentMode.idleDecay;

    }


    else if (
        idleTime <
        currentMode.heavyIdle + 1500
    ) {

        // ---------------------------------------------
        // Player has been idle for a while
        // ---------------------------------------------

        state.stability -=
            currentMode.heavyDecay;

    }


    else {

        // ---------------------------------------------
        // Completely idle
        // ---------------------------------------------

        state.stability -=
            currentMode.extremeDecay;

    }


    // =================================================
    // CLAMP STABILITY
    // =================================================

    if (state.stability < 0) {

        state.stability = 0;

    }


    // =================================================
    // CAR MOVEMENT
    // =================================================

    if (state.stability > 20) {

        state.distance +=
            state.stability / 500;

    }


    // =================================================
    // CRITICAL STABILITY DAMAGE
    // =================================================

    if (
        state.stability <=
        currentMode.criticalStability
    ) {

        state.hp -=
            currentMode.criticalDamage;

    }


    // =================================================
    // CRASH CHECK
    // =================================================

    if (state.hp <= 0) {

        state.hp = 0;

        crash();

        return;

    }


    // =================================================
    // UPDATE VISUALS
    // =================================================

    updateUI();


    // Continue game

    requestAnimationFrame(gameLoop);

}


// =====================================================
// UI UPDATE
// =====================================================

function updateUI() {

    // -------------------------------------------------
    // HP
    // -------------------------------------------------

    hpBar.style.width =
        state.hp + "%";


    hpText.textContent =
        Math.round(state.hp);


    // -------------------------------------------------
    // STABILITY
    // -------------------------------------------------

    stabilityBar.style.width =
        state.stability + "%";


    stabilityText.textContent =
        Math.round(state.stability);


    // -------------------------------------------------
    // COMBO
    // -------------------------------------------------

    comboText.textContent =
        state.combo;


    // -------------------------------------------------
    // DISTANCE
    // -------------------------------------------------

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

    if (state.startTime) {

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
            Math.round(wpm);

    }


    // =================================================
    // CAR STABILITY EFFECT
    // =================================================

    if (
        state.stability < 70
    ) {

        car.classList.add("shake");

    }

    else {

        car.classList.remove("shake");

    }


    // =================================================
    // CRITICAL EFFECT
    // =================================================

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

    if (state.gameOver)
        return;


    state.gameOver = true;

    state.running = false;

    input.disabled = true;


    // -------------------------------------------------
    // Keep PNG car.
    // Add crash class instead of replacing image.
    // -------------------------------------------------

    car.classList.add("crashed");


    gameOver.classList.remove("hidden");


    finalWpm.textContent =
        wpmText.textContent;


    finalAccuracy.textContent =
        accuracyText.textContent;


    finalDistance.textContent =
        Math.floor(
            state.distance
        ) + "m";

}


// =====================================================
// WIN
// =====================================================

function winGame() {

    if (state.gameOver)
        return;


    state.gameOver = true;

    state.running = false;

    input.disabled = true;


    gameOver.classList.remove("hidden");


    const crashIcon =
        document.querySelector(".crash");


    const title =
        document.querySelector(
            ".game-over h1"
        );


    const message =
        document.querySelector(
            ".game-over p"
        );


    if (crashIcon) {

        crashIcon.textContent =
            "🏆";

    }


    if (title) {

        title.textContent =
            "YOU WIN!";

        title.style.color =
            "#39e58c";

    }


    if (message) {

        message.textContent =
            "You completed the route!";

    }


    finalWpm.textContent =
        wpmText.textContent;


    finalAccuracy.textContent =
        accuracyText.textContent;


    finalDistance.textContent =
        Math.floor(
            state.distance
        ) + "m";

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

input.disabled = true;

startCountdown();
