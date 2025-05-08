// server/routes/productos.js
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';

// Necesario para __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Construye la ruta completa hacia almacen.db
const dbPath = path.join(__dirname, '../db/almacen.db');
console.log('Ruta base de datos:', dbPath); // Verifica que sea la correcta

const db = new Database(dbPath);

// Ruta para obtener todos los productos con almacén y ubicaciones
router.get('/', (req, res) => {
  const stmt = db.prepare(`
    SELECT 
      p.id AS producto_id,
      p.nombre AS producto,
      p.peso_unidad,
      a.nombre AS almacen,
      pa.stock,
      u.ubicacion
    FROM productos p
    JOIN producto_almacen pa ON p.id = pa.producto_id
    JOIN almacenes a ON a.id = pa.almacen_id
    JOIN ubicaciones u ON u.producto_almacen_id = pa.id
  `);

  const resultados = stmt.all();
  res.json(resultados);
});

module.exports = router;
