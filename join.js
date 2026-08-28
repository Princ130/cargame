// =====================================================
// TYPE RACER
// JOIN ROOM
// =====================================================


// =====================================================
// JOIN ROOM BUTTON
// =====================================================

const joinRoom =
    document.getElementById("joinRoom");


joinRoom.addEventListener(
    "click",
    () => {

        console.log(
            "Join Room clicked"
        );


        // ---------------------------------------------
        // Get selected car
        // ---------------------------------------------

        const selectedCar =
            localStorage.getItem("selectedCar") || "car1.png";


        console.log(
            "Joining with car:",
            selectedCar
        );


        // ---------------------------------------------
        // TEMPORARY
        // ---------------------------------------------
        // For now we are just testing the button.
        // Later this is where we will:
        //
        // 1. Ask for room code
        // 2. Connect to WebSocket
        // 3. Send room code to server
        // 4. Join the room
        // ---------------------------------------------

        const roomCode =
            prompt("Enter Room Code:");


        if (!roomCode) {

            console.log(
                "No room code entered."
            );

            return;

        }


        console.log(
            "Room code:",
            roomCode
        );


        // ---------------------------------------------
        // TEMPORARY MESSAGE
        // ---------------------------------------------

        alert(
            `Trying to join room: ${roomCode}`
        );

    }
);