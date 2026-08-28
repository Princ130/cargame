// =====================================================
// TYPE RACER DASHBOARD
// =====================================================


// =====================================================
// CAR DATA
// =====================================================

const cars = [
    "car1.png",
    "car2.png",
    "car3.png"
];


// =====================================================
// CURRENT CAR
// =====================================================

let currentCar = 0;


// =====================================================
// ELEMENTS
// =====================================================

const selectedCarImage =
    document.getElementById("selectedCarImage");

const selectedCarName =
    document.getElementById("selectedCarName");

const previousCarButton =
    document.getElementById("prevCar");

const nextCarButton =
    document.getElementById("nextCar");

const practiceSession =
    document.getElementById("practiceSession");


// =====================================================
// UPDATE CAR
// =====================================================

function updateCar() {

    const carFile =
        cars[currentCar];


    // Small transition

    selectedCarImage.classList.add(
        "car-change"
    );


    setTimeout(() => {

        selectedCarImage.src =
            `assets/${carFile}`;

        selectedCarImage.alt =
            `Car ${currentCar + 1}`;

        selectedCarName.textContent =
            `Car ${currentCar + 1}`;

        selectedCarImage.classList.remove(
            "car-change"
        );

    }, 120);


    // Save selected car immediately

    localStorage.setItem(
        "selectedCar",
        carFile
    );


    console.log(
        "Selected car:",
        carFile
    );

}


// =====================================================
// NEXT CAR
// =====================================================

nextCarButton.addEventListener(
    "click",
    () => {

        currentCar++;

        if (
            currentCar >= cars.length
        ) {

            currentCar = 0;

        }

        updateCar();

    }
);


// =====================================================
// PREVIOUS CAR
// =====================================================

previousCarButton.addEventListener(
    "click",
    () => {

        currentCar--;

        if (
            currentCar < 0
        ) {

            currentCar =
                cars.length - 1;

        }

        updateCar();

    }
);


// =====================================================
// LOAD SAVED CAR
// =====================================================

function loadSavedCar() {

    const savedCar =
        localStorage.getItem(
            "selectedCar"
        );


    if (!savedCar) {

        updateCar();

        return;

    }


    const savedIndex =
        cars.indexOf(savedCar);


    if (
        savedIndex !== -1
    ) {

        currentCar =
            savedIndex;

    }


    updateCar();

}


// =====================================================
// PRACTICE SESSION
// =====================================================

practiceSession.addEventListener(
    "click",
    () => {

        // Save selected car

        localStorage.setItem(
            "selectedCar",
            cars[currentCar]
        );


        console.log(
            "Starting practice with:",
            cars[currentCar]
        );


        // Go to race

        window.location.href =
            "race.html";

    }
);


// =====================================================
// INITIALIZE
// =====================================================

loadSavedCar();


console.log(
    "Dashboard ready."
);