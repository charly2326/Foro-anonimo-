document.addEventListener("DOMContentLoaded", function () {
    let username = localStorage.getItem("username") || "@UsuarioAnonimo";
    let bio = localStorage.getItem("bio") || "Esta es una biografía de ejemplo.";

    document.getElementById("username").textContent = username;
    document.getElementById("bio").textContent = bio;

    document.querySelector(".edit-profile").addEventListener("click", function () {
        let newUsername = prompt("Nuevo nombre de usuario:", username);
        let newBio = prompt("Nueva biografía:", bio);

        if (newUsername) {
            localStorage.setItem("username", newUsername);
            document.getElementById("username").textContent = newUsername;
        }
        if (newBio) {
            localStorage.setItem("bio", newBio);
            document.getElementById("bio").textContent = newBio;
        }
    });
});
