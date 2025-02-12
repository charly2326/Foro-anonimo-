// Abrir Modal con animación
function abrirModal() {
    let modal = document.getElementById("profileModal");
    modal.style.display = "flex";
    setTimeout(() => modal.classList.add("show"), 10); // Agrega clase para animación
}

// Cerrar Modal con animación
function cerrarModal() {
    let modal = document.getElementById("profileModal");
    modal.classList.remove("show");
    setTimeout(() => modal.style.display = "none", 300); // Espera a que termine la animación
}

// Detectar clic fuera del modal
window.onclick = function (event) {
    let modal = document.getElementById("profileModal");
    if (event.target == modal) {
        cerrarModal();
    }
};

// Publicar un Tweet con validación
function publicar() {
    let input = document.getElementById("tweetInput").value.trim();
    if (input === "") {
        alert("¡El tweet no puede estar vacío!");
        return;
    }

    // Validar longitud del tweet
    if (input.length > 280) {
        alert("¡El tweet no puede tener más de 280 caracteres!");
        return;
    }

    let tweetsContainer = document.getElementById("tweetsContainer");
    let newTweet = document.createElement("div");
    newTweet.classList.add("tweet");
    newTweet.innerHTML = `
        <img src="avatar.jpg" class="avatar">
        <div class="tweet-content">
            <h3>@usuario</h3>
            <p>${input}</p>
            <button class="delete-tweet" onclick="eliminarTweet(this)">🗑️ Eliminar</button>
        </div>
    `;
    tweetsContainer.prepend(newTweet);
    document.getElementById("tweetInput").value = "";

    // Guardar tweet en localStorage
    guardarTweets();
}

// Eliminar un Tweet
function eliminarTweet(button) {
    let tweet = button.closest(".tweet");
    tweet.classList.add("fade-out"); // Animación de desvanecimiento
    setTimeout(() => {
        tweet.remove();
        guardarTweets(); // Actualizar localStorage
    }, 300); // Espera a que termine la animación
}

// Guardar tweets en localStorage
function guardarTweets() {
    let tweets = [];
    document.querySelectorAll(".tweet p").forEach((tweet) => {
        tweets.push(tweet.innerText);
    });
    localStorage.setItem("tweets", JSON.stringify(tweets));
}

// Cargar tweets desde localStorage
function cargarTweets() {
    let tweets = JSON.parse(localStorage.getItem("tweets")) || [];
    let tweetsContainer = document.getElementById("tweetsContainer");
    tweetsContainer.innerHTML = ""; // Limpiar contenedor antes de cargar
    tweets.forEach((tweet) => {
        let newTweet = document.createElement("div");
        newTweet.classList.add("tweet");
        newTweet.innerHTML = `
            <img src="avatar.jpg" class="avatar">
            <div class="tweet-content">
                <h3>@usuario</h3>
                <p>${tweet}</p>
                <button class="delete-tweet" onclick="eliminarTweet(this)">🗑️ Eliminar</button>
            </div>
        `;
        tweetsContainer.prepend(newTweet);
    });
}

// Cargar datos guardados al iniciar
document.addEventListener("DOMContentLoaded", function () {
    cargarTweets(); // Cargar tweets guardados

    let avatar = localStorage.getItem("avatar");
    let portada = localStorage.getItem("portada");
    let name = localStorage.getItem("name") || "Nombre";
    let username = localStorage.getItem("username") || "@usuario";
    let bio = localStorage.getItem("bio") || "Biografía del usuario.";
    let location = localStorage.getItem("location") || "📍 Ubicación";
    let website = localStorage.getItem("website") || "#";
    let joined = localStorage.getItem("joined") || "📅 Se unió en Año";

    if (avatar) document.querySelector(".avatar-large").style.backgroundImage = `url(${avatar})`;
    if (portada) document.querySelector(".cover").style.backgroundImage = `url(${portada})`;

    document.getElementById("profileName").innerText = name;
    document.getElementById("profileUsername").innerText = username;
    document.getElementById("profileBio").innerText = bio;
    document.getElementById("profileLocation").innerText = location;
    document.getElementById("profileWebsite").innerHTML = `🔗 <a href="${website}" target="_blank">${website}</a>`;
    document.getElementById("profileJoined").innerText = joined;
});

// Cambiar avatar
function cambiarAvatar() {
    let inputAvatar = document.getElementById("uploadAvatar");
    inputAvatar.click();

    inputAvatar.onchange = function () {
        let file = inputAvatar.files[0];
        if (file) {
            let reader = new FileReader();
            reader.onload = function (e) {
                let imageUrl = e.target.result;
                document.querySelector(".avatar-large").style.backgroundImage = `url(${imageUrl})`;
                localStorage.setItem("avatar", imageUrl);
            };
            reader.readAsDataURL(file);
        }
    };
}

// Cambiar portada
function cambiarPortada() {
    let inputPortada = document.getElementById("uploadPortada");
    inputPortada.click();

    inputPortada.onchange = function () {
        let file = inputPortada.files[0];
        if (file) {
            let reader = new FileReader();
            reader.onload = function (e) {
                let imageUrl = e.target.result;
                document.querySelector(".cover").style.backgroundImage = `url(${imageUrl})`;
                localStorage.setItem("portada", imageUrl);
            };
            reader.readAsDataURL(file);
        }
    };
}

// Abrir modal de edición
function abrirEditor() {
    document.getElementById("editModal").style.display = "flex";

    // Cargar datos en el formulario
    document.getElementById("editName").value = document.getElementById("profileName").innerText;
    document.getElementById("editUsername").value = document.getElementById("profileUsername").innerText;
    document.getElementById("editBio").value = document.getElementById("profileBio").innerText;
    document.getElementById("editLocation").value = document.getElementById("profileLocation").innerText;
    document.getElementById("editWebsite").value = document.getElementById("profileWebsite").innerText;
}

// Guardar cambios en localStorage
function guardarCambios() {
    let name = document.getElementById("editName").value.trim();
    let username = document.getElementById("editUsername").value.trim();
    let bio = document.getElementById("editBio").value.trim();
    let location = document.getElementById("editLocation").value.trim();
    let website = document.getElementById("editWebsite").value.trim();

    // Validar campos obligatorios
    if (!name || !username) {
        alert("¡Nombre y nombre de usuario son campos obligatorios!");
        return;
    }

    localStorage.setItem("name", name);
    localStorage.setItem("username", username);
    localStorage.setItem("bio", bio);
    localStorage.setItem("location", location);
    localStorage.setItem("website", website);

    document.getElementById("profileName").innerText = name;
    document.getElementById("profileUsername").innerText = username;
    document.getElementById("profileBio").innerText = bio;
    document.getElementById("profileLocation").innerText = location;
    document.getElementById("profileWebsite").innerHTML = `🔗 <a href="${website}" target="_blank">${website}</a>`;

    cerrarEditor();
}

// Cerrar editor
function cerrarEditor() {
    document.getElementById("editModal").style.display = "none";
}
