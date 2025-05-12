import React, { useEffect, useState } from "react";

interface Producto {
  id: number;
  nombre: string;
}

interface Ubicacion {
  almacen: string;
  ubicacion: string;
  stock: number;
}

export default function Productos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [seleccionado, setSeleccionado] = useState<Producto | null>(null);
  const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);

  useEffect(() => {
    fetch("/api/productos")
      .then((res) => res.json())
      .then(setProductos)
      .catch(console.error);
  }, []);

  const seleccionarProducto = (producto: Producto) => {
    setSeleccionado(producto);
    fetch(`/api/productos/${producto.id}/almacenes`)
      .then((res) => res.json())
      .then(setUbicaciones)
      .catch(console.error);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Productos</h1>
      <ul className="mb-6 space-y-2">
        {productos.map((p) => (
          <li key={p.id}>
            <button
              onClick={() => seleccionarProducto(p)}
              className="text-blue-600 hover:underline"
            >
              {p.nombre}
            </button>
          </li>
        ))}
      </ul>

      {seleccionado && (
        <div>
          <h2 className="text-lg font-semibold">
            Almacenes para: {seleccionado.nombre}
          </h2>
          <table className="table-auto w-full mt-4 border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Almacén</th>
                <th className="border px-4 py-2">Ubicación</th>
                <th className="border px-4 py-2">Stock</th>
              </tr>
            </thead>
            <tbody>
              {ubicaciones.map((u, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{u.almacen}</td>
                  <td className="border px-4 py-2">{u.ubicacion}</td>
                  <td className="border px-4 py-2">{u.stock}</td>
                </tr>
              ))}
              {ubicaciones.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center py-4">
                    No hay ubicaciones registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
