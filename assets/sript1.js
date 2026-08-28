/* =================================
   CAR SELECTION
   ================================= */

const carCards = document.querySelectorAll(".car-card");

const selectButtons = document.querySelectorAll(".select-btn");


selectButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        /* Remove selected state */

        carCards.forEach(function(card) {

            card.classList.remove("selected");

            const btn =
                card.querySelector(".select-btn");

            btn.textContent = "Select";

        });


        /* Select clicked car */

        const selectedCard =
            button.closest(".car-card");


        selectedCard.classList.add("selected");

        button.textContent = "Selected";


        /* Get selected car */

        const selectedCar =
            selectedCard.dataset.car;


        console.log(
            "Selected Car:",
            selectedCar
        );

    });

});



/* =================================
   CREATE ROOM
   ================================= */

const createRoom =
    document.getElementById("createRoom");


createRoom.addEventListener("click", function() {

    window.location.href =
        "create-room.html";

});



/* =================================
   JOIN ROOM
   ================================= */

const joinRoom =
    document.getElementById("joinRoom");


joinRoom.addEventListener("click", function() {

    window.location.href =
        "join-room.html";

});



/* =================================
   PRACTICE SESSION
   ================================= */

const practiceSession =
    document.getElementById("practiceSession");


practiceSession.addEventListener("click", function() {

    window.location.href =
        "practice.html";

});
