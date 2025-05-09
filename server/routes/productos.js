// server/routes/productos.js
import { Router } from 'express';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolver ruta absoluta del archivo actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta a la base de datos
const dbPath = path.resolve(__dirname, '../db/almacen.db');
console.log('Ruta base de datos:', dbPath);

// Crear instancia de la base de datos
const db = new Database(dbPath);

// Crear router
const router = Router();

// Obtener productos
router.get('/', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM productos');
    const productos = stmt.all();
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

export default router;
