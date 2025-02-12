const socket = io();
const mensajesDiv = document.getElementById("mensajes");

// 🔄 Cargar mensajes desde el servidor
async function cargarMensajes() {
    try {
        const res = await fetch("/mensajes");
        if (!res.ok) throw new Error("Error al cargar los mensajes");
        const mensajes = await res.json();
        mensajesDiv.innerHTML = ""; // Limpiar mensajes previos

        const fragment = document.createDocumentFragment();
        mensajes.forEach(m => fragment.appendChild(crearMensajeElemento(m)));
        mensajesDiv.appendChild(fragment);
    } catch (error) {
        console.error("Error:", error);
        alert("Hubo un error al cargar los mensajes. Por favor, recarga la página.");
    }
}

// 📝 Crear elementos HTML para cada mensaje
function crearMensajeElemento(m, esRespuesta = false) {
    const div = document.createElement("div");
    div.classList.add("mensaje", esRespuesta ? "respuesta" : "");

    let archivoHTML = "";
    if (m.archivo) {
        if (m.tipoArchivo === "image") {
            archivoHTML = `<img src="${m.archivo}" class="archivo" alt="Archivo adjunto">`;
        } else if (m.tipoArchivo === "video") {
            archivoHTML = `<video controls class="archivo"><source src="${m.archivo}" type="video/mp4"></video>`;
        } else {
            archivoHTML = `<a href="${m.archivo}" download>📂 Descargar archivo</a>`;
        }
    }

    div.innerHTML = `
        <div class="perfil">
            <img src="${m.fotoPerfil || 'default.png'}" alt="Foto de perfil">
            <span class="nombre">${m.usuario}</span>
        </div>
        <div class="contenido">${m.contenido || "(Mensaje sin texto)"}</div>
        ${archivoHTML}
        <div class="acciones">
            <button class="boton-responder" onclick="responder(${m.id})">💬 Responder</button>
            <button onclick="reaccionar(${m.id}, 'likes')">👍 ${m.reacciones.likes || 0}</button>
            <button onclick="reaccionar(${m.id}, 'dislikes')">👎 ${m.reacciones.dislikes || 0}</button>
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

// 📤 Enviar mensaje al backend
async function publicarMensaje(respuestaId = null) {
    const usuario = document.getElementById("nombre").value.trim() || "Anónimo";
    const texto = document.getElementById("texto").value.trim();
    const archivo = document.getElementById("archivo").files[0];
    const fotoPerfil = document.getElementById("fotoPerfil").files[0];

    if (!texto && !archivo) {
        alert("Introduce un mensaje o archivo.");
        return;
    }

    const formData = new FormData();
    formData.append("usuario", usuario);
    formData.append("texto", texto);
    if (archivo) formData.append("archivo", archivo);
    if (fotoPerfil) formData.append("fotoPerfil", fotoPerfil);
    if (respuestaId) formData.append("respuestaId", respuestaId);

    try {
        const res = await fetch("/mensaje", { method: "POST", body: formData });
        if (!res.ok) throw new Error("Error al publicar el mensaje");

        document.getElementById("formMensaje").reset();
        cargarMensajes();
    } catch (error) {
        console.error("Error:", error);
        alert("Hubo un error al publicar el mensaje.");
    }
}

// 🔄 Recargar mensajes en tiempo real
socket.on("nuevoMensaje", m => {
    mensajesDiv.appendChild(crearMensajeElemento(m));
});

cargarMensajes();

