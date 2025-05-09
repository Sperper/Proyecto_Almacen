// server/server.js
import express from 'express';
import productosRoutes from './routes/productos.js';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Usa las rutas
app.use('/api/productos', productosRoutes);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
