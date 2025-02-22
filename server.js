const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// 🔥 Usar la nueva ruta de los archivos estáticos
app.use(express.static(path.join(__dirname, 'client/public')));

// 🔥 Asegurar que `index.html` se sirva correctamente
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/public/index.html'));
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

