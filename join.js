// =====================================================
// TYPE RACER
// JOIN ROOM
// =====================================================


// =====================================================
// ELEMENTS
// =====================================================

const joinRoom =
    document.getElementById("joinRoom");

const joinRoomModal =
    document.getElementById("joinRoomModal");

const closeJoinRoom =
    document.getElementById("closeJoinRoom");

const closeJoinButton =
    document.getElementById("closeJoinButton");

const roomCodeInput =
    document.getElementById("roomCodeInput");

const joinRoomConfirm =
    document.getElementById("joinRoomConfirm");

const joinError =
    document.getElementById("joinError");

const joinCarImage =
    document.getElementById("joinCarImage");

const joinCarName =
    document.getElementById("joinCarName");


// =====================================================
// OPEN JOIN ROOM
// =====================================================

joinRoom.addEventListener(
    "click",
    () => {

        console.log(
            "Join Room clicked"
        );


        // ---------------------------------------------
        // Load selected car
        // ---------------------------------------------

        const selectedCar =
            localStorage.getItem(
                "selectedCar"
            ) || "car1.png";


        joinCarImage.src =
            `assets/${selectedCar}`;


        const carNumber =
            selectedCar
                .replace("car", "")
                .replace(".png", "");


        joinCarName.textContent =
            `Car ${carNumber}`;


        // ---------------------------------------------
        // Reset input
        // ---------------------------------------------

        roomCodeInput.value = "";

        joinError.textContent = "";


        // ---------------------------------------------
        // Show modal
        // ---------------------------------------------

        joinRoomModal.classList.remove(
            "hidden"
        );


        // Focus input

        setTimeout(() => {

            roomCodeInput.focus();

        }, 100);

    }
);


// =====================================================
// JOIN ROOM
// =====================================================

joinRoomConfirm.addEventListener(
    "click",
    () => {

        const roomCode =
            roomCodeInput.value
                .trim()
                .toUpperCase();


        // ---------------------------------------------
        // Check code
        // ---------------------------------------------

        if (!roomCode) {

            showJoinError(
                "Please enter a room code."
            );

            return;

        }


        if (roomCode.length !== 6) {

            showJoinError(
                "Room code must be 6 characters."
            );

            return;

        }


        // ---------------------------------------------
        // Save room information
        // ---------------------------------------------

        const selectedCar =
            localStorage.getItem(
                "selectedCar"
            ) || "car1.png";


        localStorage.setItem(
            "roomCode",
            roomCode
        );


        localStorage.setItem(
            "roomHost",
            "false"
        );


        localStorage.setItem(
            "playerCar",
            selectedCar
        );


        console.log(
            "Joining room:",
            roomCode
        );


        console.log(
            "Joining with car:",
            selectedCar
        );


        // ---------------------------------------------
        // TEMPORARY
        // ---------------------------------------------
        // WebSocket connection will go here later.
        // ---------------------------------------------

        joinError.style.color =
            "#4ade80";

        joinError.textContent =
            "Connecting to room...";


        joinRoomConfirm.disabled =
            true;


        joinRoomConfirm.textContent =
            "CONNECTING...";


        setTimeout(() => {

            joinRoomConfirm.disabled =
                false;

            joinRoomConfirm.textContent =
                "JOIN ROOM";


            joinError.style.color =
                "#fb7185";

            joinError.textContent =
                "Room server coming soon.";

        }, 1000);

    }
);


// =====================================================
// ERROR
// =====================================================

function showJoinError(message) {

    joinError.style.color =
        "#fb7185";

    joinError.textContent =
        message;

}


// =====================================================
// CLOSE MODAL
// =====================================================

function closeJoinModal() {

    joinRoomModal.classList.add(
        "hidden"
    );

    joinError.textContent = "";

}


closeJoinRoom.addEventListener(
    "click",
    closeJoinModal
);


closeJoinButton.addEventListener(
    "click",
    closeJoinModal
);


// =====================================================
// ENTER KEY
// =====================================================

roomCodeInput.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Enter"
        ) {

            joinRoomConfirm.click();

        }

    }
);


// =====================================================
// FORCE UPPERCASE
// =====================================================

roomCodeInput.addEventListener(
    "input",
    () => {

        roomCodeInput.value =
            roomCodeInput.value
                .toUpperCase()
                .replace(
                    /[^A-Z0-9]/g,
                    ""
                );

    }
);


// =====================================================
// INITIALIZE
// =====================================================

console.log(
    "Join Room ready."
);  