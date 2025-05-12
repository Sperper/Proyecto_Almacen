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

// Obtener productos con almacenes y ubicaciones
router.get('/', (req, res) => {
  try {
    // Obtener todos los productos
    const productosStmt = db.prepare('SELECT * FROM productos');
    const productos = productosStmt.all();

    // Procesar cada producto
    const result = productos.map((producto) => {
      // Obtener almacenes asociados a este producto
      const almacenesStmt = db.prepare(`
        SELECT 
          a.id AS almacen_id,
          a.nombre AS almacen_nombre,
          pa.id AS producto_almacen_id,
          pa.stock
        FROM producto_almacen pa
        JOIN almacenes a ON pa.almacen_id = a.id
        WHERE pa.producto_id = ?
      `);
      const almacenesRaw = almacenesStmt.all(producto.id);

      // Para cada almacen, obtener ubicaciones
      const almacenes = almacenesRaw.map((almacen) => {
        const ubicacionesStmt = db.prepare(`
          SELECT ubicacion FROM ubicaciones
          WHERE producto_almacen_id = ?
        `);
        const ubicacionesRows = ubicacionesStmt.all(almacen.producto_almacen_id);
        const ubicaciones = ubicacionesRows.map((u) => u.ubicacion);

        return {
          id: almacen.almacen_id,
          nombre: almacen.almacen_nombre,
          stock: almacen.stock,
          ubicaciones
        };
      });

      // Retornar estructura completa del producto
      return {
        id: producto.id,
        nombre: producto.nombre,
        peso_unidad: producto.peso_unidad,
        almacenes
      };
    });

    res.json(result);
  } catch (error) {
    console.error('Error al obtener productos completos:', error);
    res.status(500).json({ error: 'Error al obtener productos con almacenes y ubicaciones' });
  }
});

export default router;
