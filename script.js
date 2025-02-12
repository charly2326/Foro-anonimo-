const socket = io();
const mensajesDiv = document.getElementById("mensajes");

// Generar nombre aleatorio
function generarNombreAleatorio() {
    const nombres = ["Shadow", "Storm", "Wolf", "Tiger", "Phantom", "Rogue", "Blaze", "Spectre"];
    const numero = Math.floor(Math.random() * 10000);
    return `@${nombres[Math.floor(Math.random() * nombres.length)]}${numero}`;
}

// Verificar y asignar nombre de usuario
let usuario = localStorage.getItem("usuario") || generarNombreAleatorio();
localStorage.setItem("usuario", usuario);

// Enviar usuario al backend
async function enviarUsuarioAlBackend() {
    try {
        await fetch("/api/usuario", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ usuario })
        });
    } catch (error) {
        console.error("Error al enviar usuario:", error);
    }
}

enviarUsuarioAlBackend();

// Funciones para manejar el perfil
function abrirPerfil(event) {
    event.stopPropagation();
    document.getElementById("perfilModal").style.display = "flex";
    cargarPerfil();
}

function cerrarPerfil() {
    document.getElementById("perfilModal").style.display = "none";
}

function cargarPerfil() {
    const perfil = JSON.parse(localStorage.getItem("perfilUsuario")) || {
        nombre: usuario,
        bio: "Sin biografía",
        ubicacion: "",
        enlace: "#",
        imagen: "default-perfil.jpg",
        portada: "default-portada.jpg",
        fecha: new Date().toLocaleDateString()
    };
    document.getElementById("perfilNombre").innerText = perfil.nombre;
    document.getElementById("perfilBio").innerText = perfil.bio;
    document.getElementById("perfilUbicacion").innerText = perfil.ubicacion ? "📍 " + perfil.ubicacion : "";
    document.getElementById("perfilEnlace").innerText = perfil.enlace !== "#" ? "🔗 " + perfil.enlace : "";
    document.getElementById("perfilEnlace").href = perfil.enlace;
    document.getElementById("perfilFecha").innerText = "📅 Cuenta creada el: " + perfil.fecha;
    document.getElementById("perfilImagen").src = perfil.imagen;
    document.getElementById("perfilPortada").src = perfil.portada;
}

function mostrarEditarPerfil() {
    document.getElementById("editarPerfilModal").style.display = "flex";
}

function cerrarEditarPerfil() {
    document.getElementById("editarPerfilModal").style.display = "none";
}

async function guardarPerfil() {
    const nuevoNombre = document.getElementById("nuevoNombre").value.trim();
    const nuevaBio = document.getElementById("nuevaBio").value.trim();
    const nuevaUbicacion = document.getElementById("nuevaUbicacion").value.trim();
    const nuevoEnlace = document.getElementById("nuevoEnlace").value.trim();
    const nuevaImagen = document.getElementById("nuevaImagen").files[0];
    const nuevaPortada = document.getElementById("nuevaPortada").files[0];

    if (!nuevoNombre) {
        alert("El nombre de usuario no puede estar vacío.");
        return;
    }

    const perfil = {
        nombre: nuevoNombre.startsWith("@") ? nuevoNombre : "@" + nuevoNombre,
        bio: nuevaBio,
        ubicacion: nuevaUbicacion,
        enlace: nuevoEnlace,
        imagen: nuevaImagen ? URL.createObjectURL(nuevaImagen) : document.getElementById("perfilImagen").src,
        portada: nuevaPortada ? URL.createObjectURL(nuevaPortada) : document.getElementById("perfilPortada").src,
        fecha: localStorage.getItem("perfilFecha") || new Date().toLocaleDateString()
    };

    localStorage.setItem("perfilUsuario", JSON.stringify(perfil));
    cerrarEditarPerfil();
    setTimeout(() => window.location.reload(), 300);
}

// Cargar mensajes desde el servidor
async function cargarMensajes() {
    try {
        const res = await fetch("/mensajes");
        if (!res.ok) throw new Error("Error al cargar mensajes");
        const mensajes = await res.json();
        mensajesDiv.innerHTML = "";
        const fragment = document.createDocumentFragment();
        mensajes.forEach(m => fragment.appendChild(crearMensajeElemento(m)));
        mensajesDiv.appendChild(fragment);
    } catch (error) {
        console.error("Error:", error);
        alert("Hubo un error al cargar los mensajes.");
    }
}

// Crear elemento de mensaje
function crearMensajeElemento(m, esRespuesta = false) {
    const div = document.createElement("div");
    div.classList.add("mensaje", esRespuesta ? "respuesta" : "");

    div.innerHTML = `
        <div class="perfil">
            <img src="${m.fotoPerfil || 'default.png'}" alt="Foto de perfil de ${m.usuario}">
            <span class="nombre">${m.usuario}</span>
        </div>
        <div class="contenido">${m.contenido}</div>
        ${generarArchivoHTML(m.archivo, m.tipoArchivo)}
        <div class="acciones">
            <button class="boton-responder" onclick="responder(${m.id})">💬 Responder</button>
            <button onclick="reaccionar(${m.id}, 'likes')">👍 ${m.reacciones.likes}</button>
            <button onclick="reaccionar(${m.id}, 'dislikes')">👎 ${m.reacciones.dislikes}</button>
        </div>
    `;

    if (m.respuestas) {
        const respuestasFragment = document.createDocumentFragment();
        m.respuestas.forEach(respuesta => {
            respuestasFragment.appendChild(crearMensajeElemento(respuesta, true));
        });
        div.appendChild(respuestasFragment);
    }

    return div;
}

// Generar HTML para archivos adjuntos
function generarArchivoHTML(archivo, tipoArchivo) {
    if (!archivo) return "";
    if (tipoArchivo === "image") {
        return `<img src="${archivo}" class="archivo" alt="Imagen adjunta">`;
    } else if (tipoArchivo === "video") {
        return `<video controls class="archivo"><source src="${archivo}" type="video/mp4"></video>`;
    } else {
        return `<a href="${archivo}" download>📂 Descargar archivo</a>`;
    }
}

// Publicar un mensaje
async function publicarMensaje(respuestaId = null) {
    const nombre = document.getElementById("nombre").value.trim() || "Anónimo";
    const texto = document.getElementById("texto").value.trim();
    const archivo = document.getElementById("archivo").files[0];
    const fotoPerfil = document.getElementById("fotoPerfil").files[0];

    if (!texto && !archivo) {
        alert("Introduce un mensaje o archivo.");
        return;
    }

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("texto", texto);
    if (archivo) formData.append("archivo", archivo);
    if (fotoPerfil) formData.append("fotoPerfil", fotoPerfil);
    if (respuestaId) formData.append("respuestaId", respuestaId);

    try {
        const res = await fetch("/mensaje", { method: "POST", body: formData });
        if (!res.ok) throw new Error("Error al publicar el mensaje");
        document.getElementById("texto").value = "";
        document.getElementById("archivo").value = "";
        cargarMensajes();
    } catch (error) {
        console.error("Error:", error);
        alert("Hubo un error al publicar el mensaje.");
    }
}

// Reaccionar a un mensaje
async function reaccionar(id, tipo) {
    try {
        const res = await fetch("/reaccion", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, tipo })
        });
        if (!res.ok) throw new Error("Error al registrar la reacción");
    } catch (error) {
        console.error("Error:", error);
    }
}

// Responder a un mensaje
function responder(id) {
    document.getElementById("texto").focus();
    publicarMensaje(id);
}

// Buscar mensajes
document.getElementById("buscar").addEventListener("input", e => {
    const term = e.target.value.toLowerCase();
    [...document.querySelectorAll(".mensaje")].forEach(m => {
        m.style.display = m.innerText.toLowerCase().includes(term) ? "block" : "none";
    });
});

// Escuchar eventos del servidor
socket.on("nuevoMensaje", m => {
    const fragment = document.createDocumentFragment();
    fragment.appendChild(crearMensajeElemento(m));
    mensajesDiv.appendChild(fragment);
});

socket.on("actualizarMensajes", cargarMensajes);

// Detectar clics fuera de los modales para cerrarlos
window.onclick = function(event) {
    let modalPerfil = document.getElementById("perfilModal");
    let modalEditar = document.getElementById("editarPerfilModal");

    if (event.target === modalPerfil) {
        cerrarPerfil();
    }
    if (event.target === modalEditar) {
        cerrarEditarPerfil();
    }
};

// Cargar perfil automáticamente cuando se abra el foro
document.addEventListener("DOMContentLoaded", function() {
    let perfil = JSON.parse(localStorage.getItem("perfilUsuario"));
    if (!perfil) {
        perfil = {
            nombre: "@usuario" + Math.floor(Math.random() * 10000), // Generar nombre aleatorio
            bio: "Sin biografía",
            ubicacion: "",
            enlace: "#",
            imagen: "perfil.jpg",
            portada: "portada.jpg",
            fecha: new Date
