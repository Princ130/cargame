// =====================================================
// TYPE RACER
// CREATE ROOM
// =====================================================


// =====================================================
// CREATE ROOM BUTTON
// =====================================================

const createRoom =
    document.getElementById("createRoom");


createRoom.addEventListener(
    "click",
    () => {

        console.log(
            "Create Room clicked"
        );


        // ---------------------------------------------
        // Get selected car
        // ---------------------------------------------

        const selectedCar =
            localStorage.getItem("selectedCar") || "car1.png";


        console.log(
            "Creating room with car:",
            selectedCar
        );


        // ---------------------------------------------
        // TEMPORARY ROOM CODE
        // ---------------------------------------------
        // This is only for testing the frontend.
        //
        // Later the WebSocket server will generate
        // the actual room code.
        // ---------------------------------------------

        const roomCode =
            generateRoomCode();


        console.log(
            "Room created:",
            roomCode
        );


        // ---------------------------------------------
        // Save room information
        // ---------------------------------------------

        localStorage.setItem(
            "roomCode",
            roomCode
        );

        localStorage.setItem(
            "roomHost",
            "true"
        );


        localStorage.setItem(
            "hostCar",
            selectedCar
        );


        // ---------------------------------------------
        // TEMPORARY DISPLAY
        // ---------------------------------------------

        alert(
            `Room Created!\n\nRoom Code: ${roomCode}`
        );


        // ---------------------------------------------
        // Later:
        // window.location.href = "wait.html";
        // ---------------------------------------------

    }
);


// =====================================================
// GENERATE ROOM CODE
// =====================================================

function generateRoomCode() {

    const characters =
        "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";


    let code = "";


    for (
        let i = 0;
        i < 6;
        i++
    ) {

        const randomIndex =
            Math.floor(
                Math.random() *
                characters.length
            );


        code +=
            characters[randomIndex];

    }


    return code;

}
