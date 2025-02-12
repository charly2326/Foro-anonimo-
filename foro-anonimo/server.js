const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

let mensajes = [];

const cargarMensajes = () => {
  if (fs.existsSync("mensajes.json")) {
    try {
      mensajes = JSON.parse(fs.readFileSync("mensajes.json"));
    } catch (error) {
      mensajes = [];
    }
  }
};

const guardarMensajes = () => {
  fs.writeFileSync("mensajes.json", JSON.stringify(mensajes, null, 2));
};

cargarMensajes();

app.get("/mensajes", (req, res) => res.json(mensajes));

app.post("/mensaje", upload.fields([{ name: "archivo" }, { name: "fotoPerfil" }]), (req, res) => {
  const { usuario, texto } = req.body;
  const mensaje = { id: Date.now(), usuario, contenido: texto, respuestas: [] };
  mensajes.push(mensaje);
  guardarMensajes();
  io.emit("nuevoMensaje", mensaje);
  res.sendStatus(200);
});

server.listen(3000, () => console.log("🔥 Servidor en http://localhost:3000"));

