// client/src/components/Productos.jsx
import React, { useEffect, useState } from 'react';

function Productos() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/productos')
      .then(res => res.json())
      .then(data => setProductos(data))
      .catch(console.error);
  }, []);

  return (
    <div>
      <h2>Lista de Productos</h2>
      <ul>
        {productos.map((item, index) => (
          <li key={index}>
            <strong>{item.producto}</strong> | Peso: {item.peso_por_unidad}kg | Stock: {item.stock} | Almacén: {item.almacen} | Ubicación: {item.ubicacion}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Productos;
