const createRoom =
    document.getElementById("createRoom");

const createRoomModal =
    document.getElementById("createRoomModal");

const closeCreateRoom =
    document.getElementById("closeCreateRoom");

const closeRoomButton =
    document.getElementById("closeRoomButton");

const roomCodeDisplay =
    document.getElementById("roomCodeDisplay");

const copyRoomCode =
    document.getElementById("copyRoomCode");

const roomCarImage =
    document.getElementById("roomCarImage");

const roomCarName =
    document.getElementById("roomCarName");

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
            localStorage.getItem(
                "selectedCar"
            ) || "car1.png";

        // Generate room code
        const roomCode =
            generateRoomCode();


        // Save room information

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

        // Update UI
        roomCodeDisplay.textContent =
            roomCode;
        roomCarImage.src =
            `assets/${selectedCar}`;
        const carNumber =
            selectedCar
                .replace("car", "")
                .replace(".png", "");
        roomCarName.textContent =
            `Car ${carNumber}`;
        // Show modal
        createRoomModal.classList.remove(
            "hidden"
        );
        console.log(
            "Room created:",
            roomCode
        );

    }
);


// GENERATE ROOM CODE
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

// COPY ROOM CODE
copyRoomCode.addEventListener(
    "click",
    async () => {
        const roomCode =
            roomCodeDisplay.textContent;

        try {
            await navigator.clipboard.writeText(
                roomCode
            );

            copyRoomCode.textContent =
                "✓ COPIED!";

            setTimeout(() => {
                copyRoomCode.textContent =
                    "📋 COPY CODE";
            }, 1500);

        } catch (error) {
            console.error(
                "Could not copy room code:",
                error
            );
        }
    }
);

// CLOSE MODAL
function closeRoomModal() {
    createRoomModal.classList.add(
        "hidden"
    );
}
closeCreateRoom.addEventListener(
    "click",
    closeRoomModal
);

closeRoomButton.addEventListener(
    "click",
    closeRoomModal
);
