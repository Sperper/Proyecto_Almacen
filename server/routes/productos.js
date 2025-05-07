const express = require('express');
const router = express.Router();
const Database = require('better-sqlite3');

// Conexión a la base de datos
const db = new Database('./db/almacen.db');

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
